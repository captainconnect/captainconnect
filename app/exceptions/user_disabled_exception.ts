import { Exception } from "@adonisjs/core/exceptions";
import type { HttpContext } from "@adonisjs/core/http";

export const E_USER_DISABLED = class extends Exception {
	static status: number = 400;
	static code: string = "E_USER_DISABLED";

	identifier: string = "errors.E_USER_DISABLED";

	getResponseMessage(error: this) {
		return error.message;
	}

	async handle(error: this, ctx: HttpContext) {
		const message = this.getResponseMessage(error);

		switch (ctx.request.accepts(["html", "application/vnd.api+json", "json"])) {
			case "html":
			case null:
				if (ctx.session) {
					ctx.session.flashExcept([
						"_csrf",
						"_method",
						"password",
						"password_confirmation",
					]);
					ctx.session.flashErrors({ E_USER_DISABLED: message });
					ctx.response.redirect("back", true);
				} else {
					ctx.response.status(error.status).send(message);
				}
				break;
			case "json":
				ctx.response.status(error.status).send({
					errors: [
						{
							message,
						},
					],
				});
				break;
			case "application/vnd.api+json":
				ctx.response.status(error.status).send({
					errors: [
						{
							code: error.code,
							title: message,
						},
					],
				});
				break;
		}
	}
};
