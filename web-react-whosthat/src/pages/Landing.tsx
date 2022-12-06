import { useNavigate } from "react-router-dom"

import PlaceIcon from "@mui/icons-material/Place"
import { Box } from "@mui/material"

import ListBox from "../components/ListBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"

const Landing = ({}: {}) => {
	const navigate = useNavigate()

	const areas = useRefresh(async () => [...(await AreaModel.scan().exec())])

	return (
		<Box
			sx={{
				height: "100%",
				width: "100%",

				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
			<ListBox
				title="Areas"
				data={areas?.map(area => ({ id: area.id, primary: area.name, secondary: area.id }))}
				icon={<PlaceIcon />}
				onClick={area => navigate("areas/" + area.id)}
			/>
		</Box>
	)
}

export default Landing
