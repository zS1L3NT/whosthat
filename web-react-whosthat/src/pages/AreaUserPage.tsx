import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "timeago.js"
import { v4 } from "uuid"

import { Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from "@mui/material"

import Center from "../components/Center"
import InformationBox from "../components/InformationBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"
import { UserModel } from "../models/User"
import { UserLocationModel } from "../models/UserLocation"

const AreaUserPage = ({}: {}) => {
	const { areaId, userId } = useParams()

	const [latitude, setLatitude] = useState(0)
	const [longitude, setLongitude] = useState(0)
	const [loading, setLoading] = useState(false)

	const area = useRefresh(() => AreaModel.get(areaId!))
	const user = useRefresh(() => UserModel.get(userId!))
	const userLocations = useRefresh(async () => [
		...(await UserLocationModel.scan({ user_id: userId!, area_id: areaId! }).exec())
	])

	const latestLocation = !!userLocations
		? userLocations.sort((a, b) => b.timestamp - a.timestamp)[0]
		: null

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			setLatitude(coords.latitude)
			setLongitude(coords.longitude)
		})
	}, [])

	const handleAddUserLocation = async () => {
		if (loading) return

		setLoading(true)
		try {
			await UserLocationModel.create({
				id: v4(),
				user_id: userId!,
				area_id: areaId!,
				location: {
					latitude,
					longitude
				},
				timestamp: Date.now()
			})
		} catch (err) {
			console.error(err)
		}

		setLoading(false)
	}

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
			<InformationBox
				title="User Information"
				data={{
					ID: user?.id,
					Name: user?.name,
					Email: user?.email,
					Latitude:
						latestLocation === null
							? "..."
							: latestLocation === undefined
							? "-"
							: latestLocation.location.latitude,
					Longitude:
						latestLocation === null
							? "..."
							: latestLocation === undefined
							? "-"
							: latestLocation.location.longitude,
					"Last Updated Location":
						latestLocation === null
							? "..."
							: latestLocation === undefined
							? "-"
							: format(latestLocation.timestamp)
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
					Add User Location
				</Typography>
				<Divider />
				<Box sx={{ p: 2 }}>
					<TextField
						sx={{
							width: "100%",
							mb: 2
						}}
						type="number"
						label="Latitude"
						value={latitude}
						onChange={e => setLatitude(+e.target.value)}
					/>
					<TextField
						sx={{
							width: "100%",
							mb: 2
						}}
						type="number"
						label="Longitude"
						value={longitude}
						onChange={e => setLongitude(+e.target.value)}
					/>
					<Button
						variant="outlined"
						onClick={handleAddUserLocation}>
						{loading ? <CircularProgress size={24.5} /> : "Add"}
					</Button>
				</Box>
			</Paper>
		</Center>
	)
}

export default AreaUserPage
