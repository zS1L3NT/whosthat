import { PropsWithChildren } from "react"

import { Box, CircularProgress, List, ListItem, ListItemButton, ListItemText } from "@mui/material"

import EmptyBox from "./EmptyBox"

const DetailsBox = <
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
	items: T[] | null | undefined
	onItemClick?: (item: T) => void
	max?: boolean
}>) => {
	return (
		<EmptyBox title={title}>
			{!!items ? (
				<List sx={{ height: max ? 500 : undefined }}>
					{items.map(item => (
						<ListItem
							key={item.id}
							onClick={() => onItemClick?.(item)}
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
			) : (
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
			)}
			{!!children ? <Box sx={{ p: 2 }}>{children}</Box> : null}
		</EmptyBox>
	)
}

export default DetailsBox
