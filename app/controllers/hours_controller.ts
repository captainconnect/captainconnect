import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { HourService } from "#services/hour_service";

@inject()
export default class HoursController {
	constructor(protected hourService: HourService) {}

	async getUserHours({ request, params, response }: HttpContext) {
		const userId = params.userId;

		const start_at = request.input("start_at");
		const end_at = request.input("end_at");

		const startAt = start_at ? new Date(start_at) : new Date();

		let endAt: Date;
		if (end_at) {
			endAt = new Date(end_at);
		} else {
			endAt = new Date(startAt);
			endAt.setMonth(endAt.getMonth() + 1);
		}

		if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
			return response.badRequest({
				error: "Invalid date format",
			});
		}

		// Appel service
		const hours = await this.hourService.getFormattedUserHours(
			userId,
			startAt,
			endAt,
		);

		return response.json(hours);
	}
}
