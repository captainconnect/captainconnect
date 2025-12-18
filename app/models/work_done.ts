import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Hour from "./hour.js";
import Intervention from "./intervention.js";
import Task from "./task.js";

export default class WorkDone extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "task_id" })
	declare taskId: number;

	@column({ columnName: "intervention_id" })
	declare interventionId: number;

	@column({ columnName: "work_done" })
	declare workDone: string;

	@column()
	declare usedMaterials: string | null;

	@column()
	declare date: Date;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Task)
	declare task: BelongsTo<typeof Task>;

	@belongsTo(() => Intervention)
	declare intervention: BelongsTo<typeof Intervention>;

	@hasMany(() => Hour)
	declare hours: HasMany<typeof Hour>;
}
