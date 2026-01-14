import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Boat from "./boat.js";
import Intervention from "./intervention.js";
import Media from "./media.js";
import Task from "./task.js";

export default class ProjectMedia extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "boat_id" })
	declare boatId: number;

	@column({ columnName: "media_id" })
	declare mediaId: number;

	@column({ columnName: "intervention_id" })
	declare interventionId: number | null;

	@column({ columnName: "task_id" })
	declare taskId: number | null;

	@column()
	declare caption: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Boat)
	declare boat: BelongsTo<typeof Boat>;

	@belongsTo(() => Media)
	declare media: BelongsTo<typeof Media>;

	@belongsTo(() => Intervention)
	declare intervention: BelongsTo<typeof Intervention>;

	@belongsTo(() => Task)
	declare task: BelongsTo<typeof Task>;
}
