import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

class User extends Item {
	id = ""
	name = ""
	email = ""
}

const UserSchema = new dynamoose.Schema({
	id: String,
	name: String,
	email: String
})

const UserModel = dynamoose.model<User>("User", UserSchema)

new dynamoose.Table("users", [UserModel])

export default UserModel
