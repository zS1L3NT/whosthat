import dynamoose from "dynamoose"
import { createRoot } from "react-dom/client"

import App from "./App"

dynamoose.aws.ddb.set(
	new dynamoose.aws.ddb.DynamoDB({
		region: import.meta.env.VITE_AWS_REGION,
		credentials: {
			accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
			secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
		}
	})
)

createRoot(document.getElementById("root") as HTMLElement).render(<App />)
