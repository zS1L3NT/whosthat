import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

class CameraFeed extends Item {
	id = ""
	area_id = ""
	camera_id = ""
	object_key = ""
	timestamp = 0
}

const CameraFeedSchema = new dynamoose.Schema({
	id: String,
	area_id: String,
	camera_id: String,
	object_key: String,
	timestamp: Number
})

const CameraFeedModel = dynamoose.model<CameraFeed>("CameraFeed", CameraFeedSchema)

new dynamoose.Table("camera_feeds", [CameraFeedModel])

export default CameraFeedModel
