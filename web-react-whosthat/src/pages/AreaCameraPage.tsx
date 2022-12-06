import { useState } from "react"
import { useParams } from "react-router-dom"

import {
	Box, Button, CircularProgress, Divider, ListItem, ListItemButton, ListItemText, Paper,
	Typography
} from "@mui/material"

import Center from "../components/Center"
import InformationBox from "../components/InformationBox"
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
			<InformationBox
				title="Area Information"
				data={{
					ID: area?.id,
					Name: area?.name,
					Latitude: area?.location.latitude,
					Longitude: area?.location.longitude
				}}
			/>
			<Paper
				sx={{
					width: 320,
					m: 2,
					display: "block"
				}}>
				<Typography
					sx={{
						m: 2,
						display: "inline-block",
						color: "primary.main"
					}}
					variant="h6">
					Camera Information
				</Typography>
				<Divider />
				<Box sx={{ my: 1 }}>
					<ListItem disablePadding>
						<ListItemButton>
							<ListItemText
								primary="ID"
								primaryTypographyProps={{ color: "secondary.main" }}
								secondary={cameraId}
							/>
						</ListItemButton>
					</ListItem>
					<Box sx={{ p: 2 }}>
						<img
							width="280"
							src="https://res.cloudinary.com/daily-now/image/upload/f_auto,q_auto/v1/posts/7967e36116070bb645f11a87b1aeb7fe"
						/>
					</Box>
				</Box>
			</Paper>
			<Paper
				sx={{
					width: 320,
					m: 2,
					display: "block"
				}}>
				<Typography
					sx={{
						m: 2,
						display: "inline-block",
						color: "primary.main"
					}}
					variant="h6">
					Upload Camera Feed
				</Typography>
				<Divider />
				<Box sx={{ p: 2 }}>
					<Button
						variant="outlined"
						onClick={handleUploadImage}>
						{loading ? <CircularProgress size={24.5} /> : "Upload"}
					</Button>
				</Box>
			</Paper>
		</Center>
	)
}

export default AreaCameraPage
