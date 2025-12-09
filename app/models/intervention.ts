import {
	afterCreate,
	BaseModel,
	belongsTo,
	column,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type {
	InterventionPriority,
	InterventionStatus,
} from "#types/intervention";
import Boat from "./boat.js";
import TaskGroup from "./task_group.js";

export default class Intervention extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare boatId: number;

	@column()
	declare title: string;

	@column()
	declare slug: string;

	@column()
	declare description: string | null;

	@column()
	declare status: InterventionStatus;

	@column()
	declare startAt: Date | null;

	@column()
	declare endAt: Date | null;

	@column()
	declare priority: InterventionPriority;

	@hasMany(() => TaskGroup)
	declare taskGroups: HasMany<typeof TaskGroup>;

	@belongsTo(() => Boat)
	declare boat: BelongsTo<typeof Boat>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@afterCreate()
	static async setSlug(intervention: Intervention) {
		const uniqId = crypto.randomUUID();

		intervention.slug = uniqId;
		await intervention.save();
	}
}
