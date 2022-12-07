import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { format } from "timeago.js"

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
	const user_locations = useRefresh(async () => [
		...(await UserLocationModel.scan({ user_id: userId!, area_id: areaId! }).exec())
	])

	const latestLocation = !!user_locations
		? user_locations.sort((a, b) => b.timestamp - a.timestamp)[0]
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
			await axios.post(import.meta.env.VITE_API_GATEWAY_ENDPOINT, {
				user_id: userId!,
				location: {
					latitude,
					longitude
				}
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
					{
						id: 0,
						primary: "ID",
						secondary: area ? area.id : area
					},
					{
						id: 1,
						primary: "Name",
						secondary: area ? area.name : area
					},
					{
						id: 2,
						primary: "Latitude",
						secondary: area ? area.location.latitude : area
					},
					{
						id: 3,
						primary: "Longitude",
						secondary: area ? area.location.longitude : area
					}
				]}
			/>
			<UtilityBox
				title="User Information"
				items={[
					{
						id: 0,
						primary: "ID",
						secondary: user ? user.id : user
					},
					{
						id: 1,
						primary: "Name",
						secondary: user ? user.name : user
					},
					{
						id: 2,
						primary: "Email",
						secondary: user ? user.email : user
					},
					{
						id: 3,
						primary: "Latitude",
						secondary: latestLocation
							? latestLocation.location.latitude
							: latestLocation
					},
					{
						id: 4,
						primary: "Longitude",
						secondary: latestLocation
							? latestLocation.location.longitude
							: latestLocation
					},
					{
						id: 5,
						primary: "Last Updated Location",
						secondary: latestLocation
							? format(latestLocation.timestamp)
							: latestLocation
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
