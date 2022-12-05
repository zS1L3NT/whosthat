interface ImportMetaEnv {
	readonly VITE_AWS_REGION: string
	readonly VITE_AWS_ACCESS_KEY: string
	readonly VITE_AWS_SECRET_ACCESS_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
