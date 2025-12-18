import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Task from "./task.js";
import User from "./user.js";
import WorkDone from "./work_done.js";

export default class Hour extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "user_id" })
	declare userId: number;

	@column({ columnName: "task_id" })
	declare taskId: number;

	@column({ columnName: "work_done_id" })
	declare workDoneId: number;

	@column()
	declare date: Date;

	@column()
	declare count: number;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => WorkDone)
	declare workDone: BelongsTo<typeof WorkDone>;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@belongsTo(() => Task)
	declare task: BelongsTo<typeof Task>;
}
