declare module NodeJS {
	interface ProcessEnv {
		readonly AWS_S3_BUCKET: string
		readonly AWS_SNS_TOPIC_ARN: string
	}
}