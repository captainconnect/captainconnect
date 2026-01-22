import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { RoleService } from "#services/role_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import { createUserValidator } from "#validators/user";

@inject()
export default class UsersController {
	constructor(
		protected userService: UserService,
		protected roleService: RoleService,
	) {}

	async index({ inertia }: HttpContext) {
		const users = await this.userService.getAll();
		const roles = await this.roleService.getAll();
		return inertia.render("users/index", {
			users,
			roles,
		});
	}

	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(createUserValidator);
		await this.userService.create(payload);
		return response.redirect().back();
	}

	async show({ params, inertia }: HttpContext) {
		const userId = params.userId;
		const user = await this.userService.getById(userId);
		return inertia.render("users/show", {
			user,
		});
	}

	async destroy({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.delete(userId);
		return response.redirect().toRoute("users.index");
	}

	async resetPassword({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.resetPassword(userId);
		return response.redirect().back();
	}

	async deactivate({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.deactivate(userId);
		return response.redirect().back();
	}

	async activate({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.activate(userId);
		return response.redirect().back();
	}

	async promote({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.promote(userId);
		return response.redirect().back();
	}
	async demote({ params, response }: HttpContext) {
		const userId = params.userId;
		await this.userService.demote(userId);
		return response.redirect().back();
	}
}
