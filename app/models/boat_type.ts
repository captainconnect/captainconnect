import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Boat from "./boat.js";

export default class BoatType extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare label: string;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => Boat)
	declare boats: HasMany<typeof Boat>;
}
