import {
	Box, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
	Paper, Typography
} from "@mui/material"

const ListBox = <T extends { id: string; primary: string; secondary?: string }>({
	title,
	icon,
	data,
	onClick
}: {
	title: string
	icon: JSX.Element | null
	data: T[] | null | undefined
	onClick: (item: T) => void
}) => {
	return (
		<Paper sx={{ width: 360 }}>
			<Typography
				variant="h6"
				m={2}>
				{title}
			</Typography>
			<Divider />
			{!!data ? (
				<List>
					{data.map(item => (
						<ListItem
							key={item.id}
							onClick={() => onClick(item)}
							disablePadding>
							<ListItemButton>
								{icon !== null ? <ListItemIcon>{icon}</ListItemIcon> : null}
								<ListItemText
									primary={item.primary}
									secondary={item.secondary}
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
	)
}

export default ListBox
