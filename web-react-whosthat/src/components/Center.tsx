import { PropsWithChildren } from "react"

import { Box } from "@mui/material"

const Center = ({ children }: PropsWithChildren<{}>) => {
	return (
		<Box
			sx={{
				height: "100%",
				width: "100%",

				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}>
			{children}
		</Box>
	)
}

export default Center
