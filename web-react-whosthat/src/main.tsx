import dynamoose from "dynamoose"
import { createRoot } from "react-dom/client"

import { CssBaseline, ThemeProvider } from "@mui/material"

import App from "./App"
import theme from "./theme"

dynamoose.aws.ddb.set(
	new dynamoose.aws.ddb.DynamoDB({
		region: import.meta.env.VITE_AWS_REGION,
		credentials: {
			accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
			secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
		}
	})
)

createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</ThemeProvider>
)
