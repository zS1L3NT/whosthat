import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

class UserArea extends Item {
	id: string = ""
	user_id: string = ""
	area_id: string = ""
}

const UserAreaSchema = new dynamoose.Schema({
	id: String,
	user_id: String,
	area_id: String
})

const UserAreaModel = dynamoose.model<UserArea>("UserArea", UserAreaSchema)

new dynamoose.Table("users_areas", [UserAreaModel])

export default UserAreaModel
