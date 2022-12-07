import dynamoose from "dynamoose"
import { Item } from "dynamoose/dist/Item"

import { Location } from "../@types/types"

class Report extends Item {
	id = ""
	feed_url = ""
	area: {
		id: string
		name: string
		location: Location
	} = {
		id: "",
		name: "",
		location: {
			latitude: 0,
			longitude: 0
		}
	}
	user_locations: (Location & { user_id: string })[] = []
	timestamp = 0
}

const ReportSchema = new dynamoose.Schema(
	{
		id: String,
		feed_url: String,
		area: Object,
		user_locations: Array,
		timestamp: Number
	},
	{ saveUnknown: true }
)

const ReportModel = dynamoose.model<Report>("Report", ReportSchema)

new dynamoose.Table("reports", [ReportModel])

export { Report, ReportModel }
