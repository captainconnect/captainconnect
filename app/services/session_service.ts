import { inject } from "@adonisjs/core";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { HttpContext } from "@adonisjs/core/http";
import { E_USER_DISABLED } from "#exceptions/user_disabled_exception";
import User from "#models/user";
import type { AuthenticateUserPayload } from "../../types/session.js";

@inject()
export class SessionService {
	constructor(protected ctx: HttpContext) {}

	async authenticateUser({ username, password }: AuthenticateUserPayload) {
		const user = await User.verifyCredentials(username, password);

		if (!user.activated) throw new E_USER_DISABLED("Compte désactivé");

		await this.ctx.auth.use("web").login(user);
		return user.firstLogin;
	}

	async logoutUser() {
		this.ctx.auth.use("web").logout();
	}
}
