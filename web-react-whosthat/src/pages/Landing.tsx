import { useNavigate } from "react-router-dom"

import PlaceIcon from "@mui/icons-material/Place"

import Center from "../components/Center"
import ListBox from "../components/ListBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"

const Landing = ({}: {}) => {
	const navigate = useNavigate()

	const areas = useRefresh(async () => [...(await AreaModel.scan().exec())])

	return (
		<Center>
			<ListBox
				title="Areas"
				data={areas?.map(area => ({ id: area.id, primary: area.name, secondary: area.id }))}
				icon={<PlaceIcon />}
				onClick={area => navigate("areas/" + area.id)}
			/>
		</Center>
	)
}

export default Landing
