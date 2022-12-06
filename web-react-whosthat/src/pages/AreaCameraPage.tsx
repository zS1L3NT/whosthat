import { useState } from "react"
import { useParams } from "react-router-dom"

import { Button, CircularProgress } from "@mui/material"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"
import { CameraModel } from "../models/Camera"
import { CameraFeedModel } from "../models/CameraFeed"

const AreaCameraPage = ({}: {}) => {
	const { areaId, cameraId } = useParams()

	const [loading, setLoading] = useState(false)

	const area = useRefresh(() => AreaModel.get(areaId!))
	const camera = useRefresh(() => CameraModel.get(cameraId!))
	const cameraFeeds = useRefresh(async () => [
		...(await CameraFeedModel.scan("cameraId").eq(cameraId!).exec())
	])

	const latestFeed = !!cameraFeeds
		? cameraFeeds.sort((a, b) => b.timestamp - a.timestamp)[0]
		: null

	const handleUploadImage = () => {}

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
				items={[{ id: 0, primary: "ID", secondary: cameraId }]}>
				<img
					width="280"
					src="https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/7967e36116070bb645f11a87b1aeb7fe"
				/>
			</UtilityBox>
			<UtilityBox title="Upload Camera Feed">
				<Button
					variant="outlined"
					onClick={handleUploadImage}>
					{loading ? <CircularProgress size={24.5} /> : "Upload"}
				</Button>
			</UtilityBox>
		</Center>
	)
}

export default AreaCameraPage
