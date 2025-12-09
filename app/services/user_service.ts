import User from "#models/user";
import type { UserPayload } from "#types/user";

export class UserService {
	async getAll(authenticatedUserId: number) {
		return await User.query()
			.whereNot("id", 1)
			.andWhereNot("id", authenticatedUserId)
			.orderBy("firstname", "asc")
			.preload("role");
	}

	async getAllForTask() {
		return await User.query()
			.select(["id", "firstname", "lastname"])
			.orderBy("firstname", "asc");
	}

	async getById(id: number) {
		return await User.query().where("id", id).preload("role").firstOrFail();
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
