interface ImportMetaEnv {
	readonly VITE_AWS_REGION: string
	readonly VITE_AWS_ACCESS_KEY: string
	readonly VITE_AWS_SECRET_ACCESS_KEY: string
	readonly VITE_AWS_S3_BUCKET: string
	readonly VITE_API_GATEWAY_ENDPOINT: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
