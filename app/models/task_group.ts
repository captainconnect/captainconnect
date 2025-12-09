import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Intervention from "./intervention.js";
import Task from "./task.js";

export default class TaskGroup extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare interventionId: number;

	@column()
	declare name: string;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Intervention)
	declare intervention: BelongsTo<typeof Intervention>;

	@hasMany(() => Task)
	declare tasks: HasMany<typeof Task>;
}
