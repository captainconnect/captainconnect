import string from "@adonisjs/core/helpers/string";
import {
	afterSave,
	BaseModel,
	belongsTo,
	column,
	computed,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import { DriveService } from "#services/drive_service";
import type { Coordinate } from "#types/boat";
import BoatConstructor from "./boat_constructor.js";
import BoatType from "./boat_type.js";
import Contact from "./contact.js";
import Intervention from "./intervention.js";
import Media from "./media.js";
import ProjectMedia from "./project_media.js";

const driveService = new DriveService();

export default class Boat extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare name: string;

	@column()
	declare slug: string;

	@column({ columnName: "contact_id" })
	declare contactId: number | null;

	@column({ columnName: "boat_type_id" })
	declare boatTypeId: number | null;

	@column({ columnName: "boat_constructor_id" })
	declare boatConstructorId: number | null;

	@column()
	declare model: string | null;

	@column()
	declare place: string | null;

	@column({
		prepare: (value: Coordinate | null) => {
			return value ? JSON.stringify(value) : null;
		},
		consume: (value: string | null) => {
			return value ? JSON.parse(value) : null;
		},
	})
	declare position: Coordinate | null;

	@column()
	declare mmsi: string | null;

	@column()
	declare callSign: string | null;

	@column()
	declare length: number | null;

	@column()
	declare beam: number | null;

	@column()
	declare note: string | null;

	@column({ columnName: "thumbnail_id" })
	declare thumbnailId: number | null;

	@belongsTo(() => Media, {
		foreignKey: "thumbnailId",
	})
	declare thumbnail: BelongsTo<typeof Media>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => Intervention)
	declare interventions: HasMany<typeof Intervention>;

	@belongsTo(() => Contact, { foreignKey: "contactId" })
	declare contact: BelongsTo<typeof Contact>;

	@belongsTo(() => BoatType, { foreignKey: "boatTypeId" })
	declare type: BelongsTo<typeof BoatType>;

	@belongsTo(() => BoatConstructor, { foreignKey: "boatConstructorId" })
	declare boatConstructor: BelongsTo<typeof BoatConstructor>;

	@hasMany(() => ProjectMedia)
	declare medias: HasMany<typeof ProjectMedia>;

	@afterSave()
	static async setSlug(boat: Boat) {
		boat.slug = `${boat.id}-${string.slug(boat.name, { lower: true })}`;
		await boat.save();
	}

	@computed()
	get thumbnailUrl() {
		if (!this.thumbnail) return null;
		return driveService.getUrl(this.thumbnail.objectKey);
	}
}
