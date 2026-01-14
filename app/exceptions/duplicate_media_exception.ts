import { Exception } from "@adonisjs/core/exceptions";
import type { HttpContext } from "@adonisjs/core/http";

export const E_DUPLICATE_MEDIA = class extends Exception {
	static status = 409;
	static code = "E_DUPLICATE_MEDIA";

	identifier = "errors.E_DUPLICATE_MEDIA";

	getResponseMessage(error: this) {
		return error.message;
	}

	async handle(error: this, ctx: HttpContext) {
		const message = this.getResponseMessage(error);

		switch (ctx.request.accepts(["html", "json"])) {
			case "html":
			case null:
				if (ctx.session) {
					ctx.session.flashExcept(["_csrf", "_method"]);
					ctx.session.flashErrors({ file: message });
					ctx.response.redirect("back", true);
				} else {
					ctx.response.status(error.status).send(message);
				}
				break;

			case "json":
				ctx.response.status(error.status).send({
					code: error.code,
					errors: { E_DUPLICATE_MEDIA: message },
				});
				break;
		}
	}
};
