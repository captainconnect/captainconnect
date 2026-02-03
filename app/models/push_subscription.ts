import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import User from "./user.js";

export default class PushSubscription extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "user_id" })
	declare userId: number;

	@column()
	declare endpoint: string;

	@column({ columnName: "p256dh" })
	declare p256dh: string;

	@column()
	declare auth: string;

	@column({ columnName: "user_agent" })
	declare userAgent: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;
}
