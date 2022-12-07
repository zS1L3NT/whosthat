import { PropsWithChildren } from "react"

import {
	Box, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Typography
} from "@mui/material"

const UtilityBox = <
	T extends {
		id: string | number
		primary: string | number
		secondary?: string | number
	}
>({
	children,
	title,
	items,
	onItemClick,
	max
}: PropsWithChildren<{
	title: string
	items?: T[] | null
	onItemClick?: (item: T) => void
	max?: boolean
}>) => {
	return (
		<Paper
			sx={{
				width: 320,
				m: 2,
				display: "block"
			}}>
			<Typography
				sx={{
					m: 2,
					display: "inline-block",
					color: "primary.main"
				}}
				variant="h6">
				{title}
			</Typography>
			<Divider />
			{items === null ? (
				<Box
					sx={{
						height: max ? 500 : undefined,
						p: 2
					}}>
					<CircularProgress
						sx={{
							margin: "auto",
							display: "block"
						}}
						size={30}
					/>
				</Box>
			) : items === undefined ? (
				<></>
			) : (
				<List sx={{ height: max ? 500 : undefined }}>
					{items.map(item => (
						<ListItem
							key={item.id}
							onClick={() =>
								onItemClick
									? onItemClick(item)
									: !!item.secondary
									? navigator.clipboard.writeText(item.secondary!.toString())
									: null
							}
							disablePadding>
							<ListItemButton>
								<ListItemText
									primary={item.primary}
									primaryTypographyProps={{ color: "secondary.main" }}
									secondary={
										"secondary" in item ? item.secondary ?? "..." : undefined
									}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			)}
			{!!children ? <Box sx={{ p: 2 }}>{children}</Box> : null}
		</Paper>
	)
}

export default UtilityBox
