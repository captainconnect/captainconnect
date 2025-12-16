import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type { TaskStatus } from "#types/intervention";
import Hour from "./hour.js";
import TaskGroup from "./task_group.js";

export default class Task extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "task_group_id" })
	declare taskGroupId: number;

	@column()
	declare name: string;

	@column()
	declare status: TaskStatus;

	@column()
	declare sort: number;

	@column()
	declare details: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => TaskGroup)
	declare taskGroup: BelongsTo<typeof TaskGroup>;

	@hasMany(() => Hour)
	declare hours: HasMany<typeof Hour>;
}
