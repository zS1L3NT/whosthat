import { useNavigate } from "react-router-dom"

import PlaceIcon from "@mui/icons-material/Place"
import {
	Box, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
	Paper, Typography
} from "@mui/material"

import useRefresh from "../../../hooks/useRefresh"
import { AreaModel } from "../../../models/Area"

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
			<Paper sx={{ width: 360 }}>
				<Typography
					variant="h6"
					m={2}>
					Areas
				</Typography>
				<Divider />
				{areas !== null ? (
					<List>
						{areas.map(area => (
							<ListItem
								key={area.id}
								onClick={() => navigate("areas/" + area.id)}
								disablePadding>
								<ListItemButton>
									<ListItemIcon>
										<PlaceIcon />
									</ListItemIcon>
									<ListItemText
										primary={area.name}
										secondary={area.id}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				) : (
					<Box
						sx={{
							padding: 2,

							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}>
						<CircularProgress size={30} />
					</Box>
				)}
			</Paper>
		</Box>
	)
}

export default Landing
