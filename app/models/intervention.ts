import {
	afterCreate,
	BaseModel,
	belongsTo,
	column,
	computed,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type {
	InterventionPriority,
	InterventionStatus,
} from "#types/intervention";
import Boat from "./boat.js";
import ProjectMedia from "./project_media.js";
import TaskGroup from "./task_group.js";
import WorkDone from "./work_done.js";

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

	@computed()
	get totalHours(): number {
		return (
			this.workDones?.reduce((sum, wd) => {
				if (!wd.hours || wd.hours.length === 0) return sum;

				// durée réelle = une seule heure, pas une par technicien
				const realDuration = Math.max(...wd.hours.map((h) => h.count ?? 0));

				return sum + realDuration;
			}, 0) ?? 0
		);
	}

	@hasMany(() => TaskGroup)
	declare taskGroups: HasMany<typeof TaskGroup>;

	@hasMany(() => WorkDone)
	declare workDones: HasMany<typeof WorkDone>;

	@belongsTo(() => Boat)
	declare boat: BelongsTo<typeof Boat>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => ProjectMedia)
	declare medias: HasMany<typeof ProjectMedia>;

	@afterCreate()
	static async setSlug(intervention: Intervention) {
		const uniqId = crypto.randomUUID();

		intervention.slug = uniqId;
		await intervention.save();
	}
}
