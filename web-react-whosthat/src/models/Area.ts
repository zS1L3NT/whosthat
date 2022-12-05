import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

import { Location } from "../@types/types"

class Area extends Item {
	id = ""
	name = ""
	location: Location = {
		latitude: 0,
		longitude: 0
	}
}

const AreaSchema = new dynamoose.Schema(
	{
		id: String,
		name: String,
		location: Object
	},
	{ saveUnknown: true }
)

const AreaModel = dynamoose.model<Area>("Area", AreaSchema)

new dynamoose.Table("areas", [AreaModel])

export default AreaModel
