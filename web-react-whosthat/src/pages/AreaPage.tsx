import { useNavigate, useParams } from "react-router-dom"

import CameraIcon from "@mui/icons-material/Camera"
import PersonIcon from "@mui/icons-material/Person"
import WarningIcon from "@mui/icons-material/Warning"

import Center from "../components/Center"
import InformationBox from "../components/InformationBox"
import ListBox from "../components/ListBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"
import { CameraModel } from "../models/Camera"
import { ReportModel } from "../models/Report"
import { UserModel } from "../models/User"
import { UserAreaModel } from "../models/UserArea"

const AreaPage = ({}: {}) => {
	const navigate = useNavigate()
	const { areaId } = useParams()

	const area = useRefresh(() => AreaModel.get(areaId!))
	const users = useRefresh(async () => [
		...(await UserModel.batchGet(
			[...(await UserAreaModel.scan("area_id").eq(areaId!).exec())].map(
				userArea => userArea.user_id
			)
		))
	])
	const cameras = useRefresh(async () => [
		...(await CameraModel.scan("area_id").eq(areaId!).exec())
	])
	const reports = useRefresh(async () => [
		...(await ReportModel.scan("area.id").eq(areaId!).exec())
	])

	return (
		<Center>
			<InformationBox
				title="Area Information"
				data={{
					Name: area?.name,
					Latitude: area?.location.latitude,
					Longitude: area?.location.longitude
				}}
			/>
			<ListBox
				title="Reports"
				data={reports?.map(report => ({
					id: report.id,
					primary: new Date(report.timestamp).toLocaleString(),
					secondary: report.area.name
				}))}
				icon={<WarningIcon />}
				onClick={() => {}}
			/>
			<ListBox
				title="Users"
				data={users?.map(user => ({
					id: user.id,
					primary: user.name,
					secondary: user.email
				}))}
				icon={<PersonIcon />}
				onClick={user => navigate(`users/${user.id}`)}
			/>
			<ListBox
				title="Cameras"
				data={cameras?.map(camera => ({
					id: camera.id,
					primary: camera.id
				}))}
				icon={<CameraIcon />}
				onClick={camera => navigate(`cameras/${camera.id}`)}
			/>
		</Center>
	)
}

export default AreaPage
