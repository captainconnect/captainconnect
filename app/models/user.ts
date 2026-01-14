import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import {
	BaseModel,
	belongsTo,
	column,
	computed,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import { DriveService } from "#services/drive_service";
import Hour from "./hour.js";
import Media from "./media.js";
import Role from "./role.js";

const AuthFinder = withAuthFinder(() => hash.use("argon"), {
	uids: ["username"],
	passwordColumnName: "password",
});

const driveService = new DriveService();

export default class User extends compose(BaseModel, AuthFinder) {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare username: string;

	@column()
	declare firstname: string;

	@column()
	declare lastname: string;

	@column()
	declare phone: string | null;

	@column()
	declare email: string | null;

	@column({ columnName: "avatar_id" })
	declare avatarId: number | null;

	@belongsTo(() => Media, {
		foreignKey: "avatarId",
	})
	declare avatar: BelongsTo<typeof Media>;

	@column({ serializeAs: null })
	declare password: string;

	@column()
	declare roleId: number;

	@column()
	declare firstLogin: boolean;

	@column()
	declare activated: boolean;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime | null;

	@belongsTo(() => Role)
	declare role: BelongsTo<typeof Role>;

	@hasMany(() => Hour)
	declare hours: HasMany<typeof Hour>;

	@hasMany(() => Media)
	declare medias: HasMany<typeof Media>;

	public async isAdmin() {
		return this.role.slug === "admin";
	}

	@computed()
	get avatarUrl() {
		if (!this.avatar) return null;
		return driveService.getUrl(this.avatar.objectKey);
	}
}
