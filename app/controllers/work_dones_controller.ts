import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { WorkDoneService } from "#services/work_done_service";
import { addWorkDoneValidator } from "#validators/work_done";

@inject()
export default class WorkDonesController {
	constructor(
		protected interventionService: InterventionService,
		protected workDoneService: WorkDoneService,
	) {}

	async store({ params, request, response }: HttpContext) {
		const { interventionSlug, taskId } = params;
		const { id } = await this.interventionService.getBySlug(interventionSlug);
		const payload = await request.validateUsing(addWorkDoneValidator);
		await this.workDoneService.create(id, taskId, payload);
		return response.redirect().back();
	}
}
