# IAM

## Role

**Trusted entity type**: `AWS Service`<br>
**Use case**: `Lambda`<br>
**Permissions policies**:<br>

1.  **Policy name**: `AdministratorAccess`<br>

**Role name**: `whosthat`

# IoT Core

## Thing

**Thing name**: `whosthat`<br>
**Device Shadow**: `No shadow`<br>
**Policy**: [`whosthat`](#security-policy)

## Security Policy

**Policy name**: `whosthat`<br>
**Policy document**:<br>

1.  **Policy Effect**: `Allow`<br>
    **Policy Action**: `iot:Connect`<br>
    **Policy Resource**: `*`<br>
2.  **Policy Effect**: `Allow`<br>
    **Policy Action**: `iot:Publish`<br>
    **Policy Resource**: `*`<br>
3.  **Policy Effect**: `Allow`<br>
    **Policy Action**: `iot:Receive`<br>
    **Policy Resource**: `*`<br>
4.  **Policy Effect**: `Allow`<br>
    **Policy Action**: `iot:Subscribe`<br>
    **Policy Resource**: `*`

## Message Routing Rules

**Rule name**: `whosthat`<br>
**SQL version**: `2016-03-23`<br>
**SQL statement**: `SELECT * FROM "location"`<br>
**Rule actions**:

1.  **Action**: `Lambda`<br>
    **Lambda function**: [`whosthat`](#function)

# Lambda

## Function

**Function name**: `whosthat`<br>
**Runtime**: `Node.js 16.x`<br>
**Architecture**: `x86_64`<br>
**Execution role**: `Use an existing role`
**Existing role**: [`whosthat`](#role)

### Triggers

1.  **Source**: `AWS IoT (Custom IoT Rule)`<br>
    **Rule name**: [`whosthat`](#message-routing-rules)<br>
2.  **Source**: `S3`<br>
    **Bucket**: [`whosthat`](#bucket)<br>
    **Event type**: `All object create events`<br>
3.  **Source**: `API Gateway`<br>
    **Intent**: `Create a new API`<br>
    **API type**: `HTTP API`<br>
    **Security**: `Open`<br>
    **API name**: `whosthat`<br>
    **Cross-origin resource sharing (CORS)**: `true`

### Code

[`distancediff.js`](./ts-lambda-whosthat/src/distancediff.js)<br>
[`index.js`](./ts-lambda-whosthat/src/index.js)

### Test

1.  **Event name**: `S3-Create`<br>
    **Template**: `S3 Put`<br>
    **Event JSON**:
    ```json
    {
    	"Records.0.s3.object.key": "8df4e168-c926-47b0-9e51-56ff408d41ee-1669106569684.jpg"
    }
    ```
2.  **Event name**: `User-Location`<br>
    **Event JSON**:
    ```json
    {
    	"user_id": "d8097ad2-fcfa-4846-a166-64ab94435ccf",
    	"location": {
    		"latitude": 1,
    		"longitude": 100
    	}
    }
    ```

# S3

## Bucket

**Bucket name**: `whosthat`<br>
**Object Ownership**: `ACLs enabled (Bucket owner preferred)`<br>
**Block Public Access settings for this bucket**: `Disable all 5 checkboxes`

### Bucket policy

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "whosthat",
			"Effect": "Allow",
			"Principal": "*",
			"Action": ["s3:*"],
			"Resource": ["arn:aws:s3:::whosthat", "arn:aws:s3:::whosthat/*"]
		}
	]
}
```

### Cross-origin resource sharing (CORS)

```json
[
	{
		"AllowedHeaders": ["*"],
		"AllowedMethods": ["PUT", "POST", "DELETE", "GET"],
		"AllowedOrigins": ["*"],
		"ExposeHeaders": []
	}
]
```

# API Gateway

## Cross-Origin Resource Sharing

**Access-Control-Allow-Origin**: `*`<br>
**Access-Control-Allow-Headers**: `*`<br>
**Access-Control-Allow-Methods**: `*`<br>

# Simple Notification Service

## Topic

**Type**: `Standard`<br>
**Name**: `whosthat`

## Subscription

**Topic ARN**: [`whosthat`](#topic)<br>
**Protocol**: `Email`<br>
**Endpoint**: `{Email Address}`

# DynamoDB

## Tables

1.  **Table name**: `areas`<br>
    **Partition key**: `id`<br>
2.  **Table name**: `cameras`<br>
    **Partition key**: `id`<br>
3.  **Table name**: `camera_feeds`<br>
    **Partition key**: `id`<br>
4.  **Table name**: `reports`<br>
    **Partition key**: `id`<br>
5.  **Table name**: `users`<br>
    **Partition key**: `id`<br>
6.  **Table name**: `users_areas`<br>
    **Partition key**: `id`<br>
7.  **Table name**: `user_locations`<br>
    **Partition key**: `id`
