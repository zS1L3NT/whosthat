import { useNavigate } from "react-router-dom"

import Center from "../components/Center"
import UtilityBox from "../components/UtilityBox"
import useRefresh from "../hooks/useRefresh"
import { AreaModel } from "../models/Area"

const Landing = ({}: {}) => {
	const navigate = useNavigate()

	const areas = useRefresh(async () => [...(await AreaModel.scan().exec())])

	return (
		<Center>
			<UtilityBox
				title="Areas"
				items={
					areas?.map(area => ({
						id: area.id,
						primary: area.name,
						secondary: area.id
					})) ?? null
				}
				onItemClick={area => navigate("areas/" + area.id)}
				max={true}
			/>
		</Center>
	)
}

export default Landing
