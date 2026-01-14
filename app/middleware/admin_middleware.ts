import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";

export default class AdminMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		/**
		 * Middleware logic goes here (before the next call)
		 */
		const user = await ctx.auth.authenticate();
		const role = user.roleId;
		if (role !== 2) {
			return ctx.response.redirect("/");
		}

		/**
		 * Call next method in the pipeline and return its output
		 */
		const output = await next();
		return output;
	}
}
