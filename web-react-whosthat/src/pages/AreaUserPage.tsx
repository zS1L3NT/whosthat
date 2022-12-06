import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "timeago.js"
import { v4 } from "uuid"

import { Button, CircularProgress, TextField } from "@mui/material"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
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
				title="User Information"
				items={[
					{ id: 0, primary: "ID", secondary: user?.id },
					{ id: 1, primary: "Name", secondary: user?.name },
					{ id: 2, primary: "Email", secondary: user?.email },
					{
						id: 3,
						primary: "Latitude",
						secondary:
							latestLocation === null
								? "..."
								: latestLocation === undefined
								? "-"
								: latestLocation.location.latitude
					},
					{
						id: 4,
						primary: "Longitude",
						secondary:
							latestLocation === null
								? "..."
								: latestLocation === undefined
								? "-"
								: latestLocation.location.longitude
					},
					{
						id: 5,
						primary: "Last Updated Location",
						secondary:
							latestLocation === null
								? "..."
								: latestLocation === undefined
								? "-"
								: format(latestLocation.timestamp)
					}
				]}
			/>
			<UtilityBox title="Add User Location">
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
			</UtilityBox>
		</Center>
	)
}

export default AreaUserPage
