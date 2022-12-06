import {
	Box, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography
} from "@mui/material"

const InformationBox = ({ title, data }: { title: string; data: Record<string, any> }) => {
	return (
		<Paper
			sx={{
				width: 320,
				m: 2
			}}>
			<Typography
				variant="h6"
				m={2}>
				{title}
			</Typography>
			<Divider />
			{!!data ? (
				<List>
					{Object.entries(data).map(([key, value]) => (
						<ListItem
							key={key}
							disablePadding>
							<ListItemButton>
								<ListItemText
									primary={key}
									secondary={value ?? "..."}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			) : (
				<Box
					sx={{
						height: 500,
						padding: 3
					}}>
					<CircularProgress
						sx={{
							margin: "auto",
							display: "block"
						}}
						size={30}
					/>
				</Box>
			)}
		</Paper>
	)
}

export default InformationBox
