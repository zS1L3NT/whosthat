import AWS from "aws-sdk"
import { randomUUID } from "crypto"

import distancediff from "./distancediff"

import type { PublishInput, PublishResponse } from "aws-sdk/clients/sns"
import type { DetectLabelsRequest, DetectLabelsResponse } from "aws-sdk/clients/rekognition"
import type {
	GetItemInput,
	GetItemOutput,
	PutItemInput,
	PutItemOutput,
	ScanInput,
	ScanOutput,
	UpdateItemInput,
	UpdateItemOutput
} from "aws-sdk/clients/dynamodb"
import type { AttributeValue, S3CreateEvent } from "aws-lambda"
type IotLocationEvent = {
	user_id: string
	location: {
		latitude: number
		longitude: number
	}
}

const ddb = new AWS.DynamoDB()
const rekog = new AWS.Rekognition()
const sns = new AWS.SNS()

const promisify = async <I, O>(func: Function, param: I): Promise<O> => {
	return new Promise((res, rej) => {
		func(param, (err: any, data: O) => {
			if (err) rej(err)
			else res(data)
		})
	})
}

const log = (title: string, data?: any) => {
	if (data) {
		console.log(title, JSON.stringify(data, null, 4))
	} else {
		console.log(title)
	}
}

export const handler = async (event: S3CreateEvent | IotLocationEvent) => {
	const area_ids = <string[]>[]
	let data: any

	if ("location" in event) {
		// IOT Core Location Event
		log(">> IoT Location Event", event)
		data = await promisify<ScanInput, ScanOutput>(ddb.scan.bind(ddb), {
			TableName: "users_areas",
			FilterExpression: "user_id = :user_id",
			ExpressionAttributeValues: {
				":user_id": { S: event.user_id }
			}
		})

		area_ids.push(...(<ScanOutput>data).Items!.map(item => item.area_id!.S!))
		log("Area IDs for locations connected to user", { area_ids })

		// Store location into all areas
		await Promise.all(
			area_ids.map(async area_id =>
				promisify<PutItemInput, PutItemOutput>(ddb.putItem.bind(ddb), {
					TableName: "user_locations",
					Item: {
						id: { S: randomUUID() },
						user_id: { S: event.user_id },
						area_id: { S: area_id },
						location: {
							M: {
								latitude: { N: event.location.latitude + "" },
								longitude: { N: event.location.longitude + "" }
							}
						},
						timestamp: { N: Date.now() + "" }
					}
				})
			)
		)
		log("Stored location of user into all areas", { area_ids })
	} else {
		// S3 Create Camera Feed Event
		log(">> S3 Create Camera Feed Event", event)
		const record = event.Records[0]!
		const filenameRegex =
			/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})-(\d{13})/
		const filenameMatch = record.s3.object.key.match(filenameRegex)

		log("Filename match", filenameMatch)
		if (filenameMatch) {
			const [camera_id, timestamp] = filenameMatch.slice(1) as [string, string]
			log("Filename match found", { camera_id, timestamp })

			// Get area_id of camera
			data = await promisify<GetItemInput, GetItemOutput>(ddb.getItem.bind(ddb), {
				TableName: "cameras",
				Key: {
					id: { S: camera_id }
				}
			})
			const area_id = (<GetItemOutput>data).Item!.area_id!.S!
			log("Area ID of camera", { area_id })

			area_ids.push(area_id)

			data = await promisify<ScanInput, ScanOutput>(ddb.scan.bind(ddb), {
				TableName: "camera_feeds",
				FilterExpression: "camera_id = :camera_id",
				ExpressionAttributeValues: {
					":camera_id": { S: camera_id }
				}
			})
			const camera_feed_id = (<ScanOutput>data).Items![0]?.id?.S
			log("Camera Feed ID of camera", { camera_feed_id })

			if (camera_feed_id) {
				await promisify<UpdateItemInput, UpdateItemOutput>(ddb.updateItem.bind(ddb), {
					TableName: "camera_feeds",
					Key: {
						id: { S: camera_feed_id }
					},
					AttributeUpdates: {
						object_key: {
							Value: { S: record.s3.object.key }
						},
						timestamp: {
							Value: { N: timestamp }
						}
					}
				})
				log("Updated camera feed by ID", {
					object_key: record.s3.object.key,
					timestamp
				})
			} else {
				await promisify<PutItemInput, PutItemOutput>(ddb.putItem.bind(ddb), {
					TableName: "camera_feeds",
					Item: {
						id: { S: randomUUID() },
						area_id: { S: area_id },
						camera_id: { S: camera_id },
						object_key: { S: record.s3.object.key },
						timestamp: { N: timestamp }
					}
				})
				log("Created camera feed", {
					area_id,
					camera_id,
					object_key: record.s3.object.key,
					timestamp
				})
			}
		}
	}

	log("<< Looping through area_ids", { area_ids })
	for (const area_id of area_ids) {
		// Get area data
		log("Area ID", { area_id })
		data = await promisify<GetItemInput, GetItemOutput>(ddb.getItem.bind(ddb), {
			TableName: "areas",
			Key: {
				id: { S: area_id }
			}
		})
		const area = {
			id: area_id,
			name: (<GetItemOutput>data).Item!.name!.S!,
			location: {
				latitude: +(<GetItemOutput>data).Item!.location!.M!.latitude!.N!,
				longitude: +(<GetItemOutput>data).Item!.location!.M!.longitude!.N!
			}
		}
		log("Area", { area })

		// Get locations of all users
		data = await promisify<ScanInput, ScanOutput>(ddb.scan.bind(ddb), {
			TableName: "user_locations",
			FilterExpression: "area_id = :area_id AND #timestamp > :timestamp",
			ExpressionAttributeNames: {
				"#timestamp": "timestamp"
			},
			ExpressionAttributeValues: {
				":area_id": { S: area_id },
				// Dates within the 5 minutes
				":timestamp": { N: Date.now() - 5 * 60 * 1000 + "" }
			}
		})
		const userLocations = (<ScanOutput>data).Items!.map(item => ({
			latitude: +item.location!.M!.latitude!.N!,
			longitude: +item.location!.M!.longitude!.N!
		}))
		log("User locations", { userLocations })

		// Calculate if all users are >10m away from area
		const allUsersAway = userLocations.every(
			userLocation => distancediff(userLocation, area.location) > 10
		)
		log("All users away", { allUsersAway })
		if (allUsersAway) {
			// User Rekognition to detect human in image
			data = await promisify<ScanInput, ScanOutput>(ddb.scan.bind(ddb), {
				TableName: "camera_feeds",
				FilterExpression: "area_id = :area_id",
				ExpressionAttributeValues: {
					":area_id": { S: area_id }
				}
			})
			log("Camera feed data", { data })

			if ((<ScanOutput>data).Count! > 0) {
				const object_key = (<ScanOutput>data).Items![0]!.object_key!.S!
				data = await promisify<DetectLabelsRequest, DetectLabelsResponse>(
					rekog.detectLabels.bind(rekog),
					{
						Image: {
							S3Object: {
								Bucket: "whosthat",
								Name: object_key
							}
						}
					}
				)
				log("Rekognition data", { data })

				const personDetected = !!(<DetectLabelsResponse>data).Labels!.find(
					label =>
						label.Name === "Person" ||
						label.Parents?.find(parent => parent.Name === "Person")
				)
				log("Person detected", { personDetected })
				if (personDetected) {
					log("Publishing to SNS topics and DynamoDB")
					await Promise.all([
						promisify<PublishInput, PublishResponse>(sns.publish.bind(sns), {
							TopicArn: "arn:aws:sns:us-east-1:310474367837:whosthat",
							Message: `Person detected in ${
								area.name
							} at ${new Date().toString()} while all authorized users' locations are away from the area! Check the image at https://whosthat.s3.amazonaws.com/${object_key}`
						}),
						promisify<PutItemInput, PutItemOutput>(ddb.putItem.bind(ddb), {
							TableName: "reports",
							Item: {
								id: { S: randomUUID() },
								feed_url: { S: `https://whosthat.s3.amazonaws.com/${object_key}` },
								area: {
									M: {
										id: { S: area.id },
										name: { S: area.name },
										location: {
											M: {
												latitude: { N: area.location.latitude + "" },
												longitude: { N: area.location.longitude + "" }
											}
										}
									}
								},
								userLocations: {
									L: userLocations.map<AttributeValue>(userLocation => ({
										M: {
											latitude: { N: userLocation.latitude + "" },
											longitude: { N: userLocation.longitude + "" }
										}
									}))
								},
								timestamp: { N: Date.now() + "" }
							}
						})
					])
				}
			} else {
				log("No camera feeds found in the area", { area })
			}
		}
	}

	log("Done")
}