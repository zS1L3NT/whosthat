import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

class Camera extends Item {
	id = ""
	area_id = ""
}

const CameraSchema = new dynamoose.Schema({
	id: String,
	area_id: String
})

const CameraModel = dynamoose.model<Camera>("Camera", CameraSchema)

new dynamoose.Table("cameras", [CameraModel])

export default CameraModel
