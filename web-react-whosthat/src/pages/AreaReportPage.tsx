import { useParams } from "react-router-dom"

import { Box, CircularProgress } from "@mui/material"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
import useRefresh from "../hooks/useRefresh"
import { ReportModel } from "../models/Report"
import { UserModel } from "../models/User"

const AreaReportPage = ({}: {}) => {
	const { areaId, reportId } = useParams()

	const report = useRefresh(() => ReportModel.get(reportId!))
	const users = useRefresh(
		async () => [
			...(report?.user_locations && report.user_locations.length > 0
				? await UserModel.batchGet(report.user_locations.map(ul => ul.user_id))
				: [])
		],
		[report]
	)

	return (
		<Center>
			<UtilityBox
				title="Area Information"
				items={[
					{ id: 0, primary: "ID", secondary: areaId },
					{ id: 1, primary: "Name", secondary: report?.area?.name },
					{ id: 2, primary: "Latitude", secondary: report?.area?.location.latitude },
					{ id: 3, primary: "Longitude", secondary: report?.area?.location.longitude }
				]}
			/>
			<UtilityBox
				title="Report Information"
				items={[
					{ id: 0, primary: "ID", secondary: reportId },
					{
						id: 1,
						primary: "Timestamp",
						secondary: report ? new Date(report.timestamp).toLocaleString() : ""
					}
				]}>
				{report?.feed_url ? (
					<img
						width="280"
						height="157.5"
						src={report.feed_url}
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
						{report?.feed_url === null ? <CircularProgress size={24} /> : "-"}
					</Box>
				)}
			</UtilityBox>
			<UtilityBox
				title="User Location Information"
				items={report?.user_locations.map(ul => ({
					id: ul.user_id,
					primary: users?.find(u => u.id === ul.user_id)?.name ?? "...",
					secondary: ul.latitude + ", " + ul.longitude
				}))}
			/>
		</Center>
	)
}

export default AreaReportPage
