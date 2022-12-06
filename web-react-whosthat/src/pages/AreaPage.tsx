import { useNavigate, useParams } from "react-router-dom"

import Center from "../components/Center"
import DetailsBox from "../components/DetailsBox"
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
			<DetailsBox
				title="Area Information"
				items={[
					{ id: 0, primary: "ID", secondary: area?.id },
					{ id: 1, primary: "Name", secondary: area?.name },
					{ id: 2, primary: "Latitude", secondary: area?.location.latitude },
					{ id: 3, primary: "Longitude", secondary: area?.location.longitude }
				]}
			/>
			<DetailsBox
				title="Reports"
				items={reports?.map(report => ({
					id: report.id,
					primary: new Date(report.timestamp).toLocaleString(),
					secondary: report.area.name
				}))}
				max={true}
			/>
			<DetailsBox
				title="Users"
				items={users?.map(user => ({
					id: user.id,
					primary: user.name,
					secondary: user.email
				}))}
				onItemClick={user => navigate(`users/${user.id}`)}
				max={true}
			/>
			<DetailsBox
				title="Cameras"
				items={cameras?.map(camera => ({
					id: camera.id,
					primary: camera.id
				}))}
				onItemClick={camera => navigate(`cameras/${camera.id}`)}
				max={true}
			/>
		</Center>
	)
}

export default AreaPage
