import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import PlaceIcon from "@mui/icons-material/Place"
import {
	Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography
} from "@mui/material"

import { Area, AreaModel } from "../../../models/Area"

const Landing = ({}: {}) => {
	const navigate = useNavigate()

	const [areas, setAreas] = useState<Area[]>([])

	useEffect(() => {
		refreshAreas()
		const interval = setInterval(refreshAreas, 3000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	const refreshAreas = () => {
		AreaModel.scan()
			.exec()
			.then(data => setAreas([...data]))
			.catch(console.error)
	}

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
			</Paper>
		</Box>
	)
}

export default Landing
