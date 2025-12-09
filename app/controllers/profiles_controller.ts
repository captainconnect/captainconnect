import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { HourService } from "#services/hour_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { ProfileService } from "#services/profile_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import {
	updatePasswordValidator,
	updateProfileValidator,
} from "#validators/user";

@inject()
export default class ProfilesController {
	constructor(
		protected userService: UserService,
		protected profileService: ProfileService,
		protected hourService: HourService,
	) {}

	async show({ auth, inertia }: HttpContext) {
		const user = await auth.authenticate();
		return inertia.render("profile/show", {
			user,
		});
	}

	async updateProfile({ request, auth, response }: HttpContext) {
		const { id: userId } = await auth.authenticate();
		const payload = await request.validateUsing(updateProfileValidator);
		await this.profileService.update(userId, payload);
		return response.redirect().back();
	}

	async updatePassword({ request, auth, response }: HttpContext) {
		const { id: userId } = await auth.authenticate();
		const payload = await request.validateUsing(updatePasswordValidator);
		await this.userService.updatePassword(userId, payload.password);
		return response.redirect().back();
	}
}
