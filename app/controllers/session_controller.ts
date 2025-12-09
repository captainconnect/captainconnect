import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { SessionService } from "#services/session_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import { authenticationValidator } from "#validators/authentication";
import { updatePasswordValidator } from "#validators/user";

@inject()
export default class SessionController {
	constructor(
		protected sessionService: SessionService,
		protected userService: UserService,
	) {}

	async show({ inertia }: HttpContext) {
		return inertia.render("auth/login");
	}

	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(authenticationValidator);

		const firstLogin = await this.sessionService.authenticateUser(payload);
		if (firstLogin) return response.redirect().toRoute("session.edit");

		return response.redirect("/");
	}

	async edit({ auth, inertia, response }: HttpContext) {
		const user = auth.user;

		if (!user?.firstLogin) return response.redirect("/");

		return inertia.render("auth/firstLogin");
	}

	async update({ request, auth, response }: HttpContext) {
		if (!auth.user) {
			return response.unauthorized();
		}
		const userId = auth.user.id;
		const payload = await request.validateUsing(updatePasswordValidator);

		await this.userService.updatePassword(userId, payload.password);

		return response.redirect("/");
	}

	async destroy({ response }: HttpContext) {
		await this.sessionService.logoutUser();
		return response.redirect().toRoute("session.show");
	}
}
