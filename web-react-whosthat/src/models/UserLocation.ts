import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

import { Location } from "../@types/types"

class UserLocation extends Item {
	id = ""
	user_id = ""
	area_id = ""
	location: Location = {
		latitude: 0,
		longitude: 0
	}
	timestamp = 0
}

const UserLocationSchema = new dynamoose.Schema(
	{
		id: String,
		user_id: String,
		area_id: String,
		location: Object,
		timestamp: Number
	},
	{ saveUnknown: true }
)

const UserLocationModel = dynamoose.model<UserLocation>("UserLocation", UserLocationSchema)

new dynamoose.Table("user_locations", [UserLocationModel])

export { UserLocation, UserLocationModel }
