import { useNavigate, useParams } from "react-router-dom"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
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
				title="Reports"
				items={
					reports?.map(report => ({
						id: report.id,
						primary: new Date(report.timestamp).toLocaleString(),
						secondary: report.area.name
					})) ?? null
				}
				max={true}
			/>
			<UtilityBox
				title="Users"
				items={
					users?.map(user => ({
						id: user.id,
						primary: user.name,
						secondary: user.email
					})) ?? null
				}
				onItemClick={user => navigate(`users/${user.id}`)}
				max={true}
			/>
			<UtilityBox
				title="Cameras"
				items={
					cameras?.map(camera => ({
						id: camera.id,
						primary: camera.id
					})) ?? null
				}
				onItemClick={camera => navigate(`cameras/${camera.id}`)}
				max={true}
			/>
		</Center>
	)
}

export default AreaPage
