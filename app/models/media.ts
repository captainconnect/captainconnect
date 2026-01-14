import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import User from "./user.js";

export default class Media extends BaseModel {
	public static table = "medias";

	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare bucket: string;

	@column({ columnName: "object_key" })
	declare objectKey: string;

	@column({ columnName: "mime_type" })
	declare mimeType: string;

	@column()
	declare extension: string | null;

	@column({ columnName: "byte_size" })
	declare byteSize: number;

	@column()
	declare width: number | null;

	@column()
	declare height: number | null;

	@column({ columnName: "checksum_sha256" })
	declare checksumSha256: string;

	@column({ columnName: "original_name" })
	declare originalName: string;

	@column()
	declare ownerId: number | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => User)
	declare users: HasMany<typeof User>;

	@belongsTo(() => User, {
		foreignKey: "ownerId",
	})
	declare owner: BelongsTo<typeof User>;
}
