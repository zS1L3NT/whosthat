import { PropsWithChildren } from "react"

import { Divider, Paper, Typography } from "@mui/material"

const EmptyBox = ({ children, title }: PropsWithChildren<{ title: string }>) => {
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
			{children}
		</Paper>
	)
}

export default EmptyBox
