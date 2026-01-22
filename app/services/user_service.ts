import { inject } from "@adonisjs/core";
import app from "@adonisjs/core/services/app";
import emitter from "@adonisjs/core/services/emitter";
import Media from "#models/media";
import User from "#models/user";
import type { UserPayload } from "#types/user";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { DriveService } from "./drive_service.js";

@inject()
export class UserService {
	constructor(protected driveService: DriveService) {}

	async getAll() {
		return await User.query()
			// .whereNot("id", 1)
			// .andWhereNot("id", authenticatedUserId)
			.orderBy("firstname", "asc")
			.preload("role")
			.preload("avatar");
	}

	async getAllForTask() {
		const query = User.query()
			.select(["id", "firstname", "lastname"])
			.orderBy("id", "desc");

		if (app.inProduction) {
			query.whereNot("id", 2);
		}
		return await query;
	}

	async getById(id: number) {
		return await User.query()
			.where("id", id)
			.preload("role")
			.preload("avatar")
			.firstOrFail();
	}

	async create(payload: UserPayload) {
		await User.create({
			firstname: payload.firstname,
			lastname: payload.lastname,
			roleId: payload.role_id,
			username: payload.username,
			password: payload.username.replaceAll(".", ""),
		});
	}

	async delete(id: number) {
		const user = await User.findOrFail(id);
		const { avatarId } = user;
		const media = await Media.find(avatarId);
		if (media) {
			emitter.emit("user:deleted", media);
		}
		await media?.delete();
		await user.delete();
	}

	async updatePassword(id: number, password: string) {
		const user = await User.findOrFail(id);
		user.password = password;
		user.firstLogin = false;
		await user.save();
	}

	async resetPassword(id: number) {
		const user = await User.findOrFail(id);
		const newPassword = (user.firstname + user.lastname).toLowerCase();
		user.password = newPassword;
		user.firstLogin = true;
		await user.save();
	}

	async deactivate(id: number) {
		const user = await User.findOrFail(id);
		user.activated = false;
		await user.save();
	}

	async activate(id: number) {
		const user = await User.findOrFail(id);
		user.activated = true;
		await user.save();
	}

	async promote(id: number) {
		const user = await User.findOrFail(id);
		user.roleId = 2;
		await user.save();
	}

	async demote(id: number) {
		const user = await User.findOrFail(id);
		user.roleId = 1;
		await user.save();
	}
}
