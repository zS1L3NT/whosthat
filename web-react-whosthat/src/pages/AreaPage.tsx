import { useParams } from "react-router-dom"

import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"
import { CameraModel } from "../models/Camera"
import { ReportModel } from "../models/Report"
import { UserModel } from "../models/User"
import { UserAreaModel } from "../models/UserArea"

const AreaPage = ({}: {}) => {
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

	return <></>
}

export default AreaPage
