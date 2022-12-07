import { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { uploadFile } from "react-s3"
import { format } from "timeago.js"

import { Box, Button, CircularProgress } from "@mui/material"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"
import { CameraFeedModel } from "../models/CameraFeed"

const AreaCameraPage = ({}: {}) => {
	const { areaId, cameraId } = useParams()

	const imageInputRef = useRef<HTMLInputElement>(null)
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)

	const area = useRefresh(() => AreaModel.get(areaId!))
	const cameraFeeds = useRefresh(async () => [
		...(await CameraFeedModel.scan("camera_id").eq(cameraId!).exec())
	])

	const latestFeed = !!cameraFeeds
		? cameraFeeds.sort((a, b) => b.timestamp - a.timestamp)[0]
		: null

	const handleChooseFile = () => {
		if (file) {
			setFile(null)
			imageInputRef.current!.value = ""
		} else {
			imageInputRef.current?.click()
		}
	}

	const handleUploadImage = async () => {
		setLoading(true)

		try {
			Object.defineProperty(file, "name", {
				writable: true,
				value: `${cameraId}-${Date.now()}.jpg`
			})

			await uploadFile(file, {
				bucketName: import.meta.env.VITE_AWS_S3_BUCKET,
				region: import.meta.env.VITE_AWS_REGION,
				accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
				secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
			})

			setFile(null)
			imageInputRef.current!.value = ""
		} catch (err) {
			console.error(err)
		}

		setLoading(false)
	}

	return (
		<Center>
			<UtilityBox
				title="Area Information"
				items={[
					{ id: 0, primary: "ID", secondary: area?.id },
					{ id: 1, primary: "Name", secondary: area?.name },
					{ id: 2, primary: "Latitude", secondary: area?.location.latitude },
					{ id: 3, primary: "Longitude", secondary: area?.location.longitude }
				]}
			/>
			<UtilityBox
				title="Camera Information"
				items={[
					{ id: 0, primary: "ID", secondary: cameraId },
					{
						id: 1,
						primary: "Object Key",
						secondary:
							latestFeed === null
								? "..."
								: latestFeed === undefined
								? "-"
								: latestFeed.object_key
					},
					{
						id: 2,
						primary: "Last Updated Feed",
						secondary:
							latestFeed === null
								? "..."
								: latestFeed === undefined
								? "-"
								: format(latestFeed.timestamp)
					}
				]}>
				{latestFeed ? (
					<img
						width="280"
						height="157.5"
						src={"https://whosthat.s3.amazonaws.com/" + latestFeed.object_key}
					/>
				) : (
					<Box
						sx={{
							width: 280,
							height: 157.5,

							borderWidth: 1,
							borderStyle: "solid",
							borderColor: "primary.main",

							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}>
						{latestFeed === null ? <CircularProgress size={24} /> : "-"}
					</Box>
				)}
			</UtilityBox>
			<UtilityBox title="Upload Camera Feed">
				{file ? (
					<img
						width="280"
						height="157.5"
						src={URL.createObjectURL(file)}
					/>
				) : (
					<Box
						sx={{
							width: 280,
							height: 157.5,

							borderWidth: 1,
							borderStyle: "solid",
							borderColor: "primary.main",

							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}>
						-
					</Box>
				)}
				<Button
					sx={{
						mt: 2,
						display: "block"
					}}
					variant="outlined"
					onClick={handleChooseFile}>
					{file ? "Clear File" : "Choose File"}
				</Button>
				<Button
					sx={{ mt: 1 }}
					variant="outlined"
					onClick={handleUploadImage}
					disabled={!file}>
					{loading ? <CircularProgress size={24.5} /> : "Upload"}
				</Button>
				<input
					ref={imageInputRef}
					type="file"
					onInput={e => setFile(e.currentTarget.files![0] ?? null)}
					hidden
				/>
			</UtilityBox>
		</Center>
	)
}

export default AreaCameraPage
