import string from "@adonisjs/core/helpers/string";
import {
	afterSave,
	BaseModel,
	belongsTo,
	column,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type { GPSPoint } from "#types/boat";
import BoatConstructor from "./boat_constructor.js";
import BoatType from "./boat_type.js";
import Contact from "./contact.js";
import Intervention from "./intervention.js";

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

	@column()
	declare position: GPSPoint | null;

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

	@afterSave()
	static async setSlug(boat: Boat) {
		boat.slug = `${boat.id}-${string.slug(boat.name, { lower: true })}`;
		await boat.save();
	}
}
