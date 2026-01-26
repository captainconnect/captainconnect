import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
import { orderingInterventionValidator } from "#validators/intervention";

@inject()
export default class AdministrationController {
	constructor(protected interventionService: InterventionService) {}

	async index({ inertia }: HttpContext) {
		return inertia.render("administration/index");
	}

	async interventionOrganisation({ inertia }: HttpContext) {
		const interventions =
			await this.interventionService.getInterventionsForOrder();
		return inertia.render("administration/InterventionsOrganisation", {
			interventions,
		});
	}

	async interventionOrdering({ request, response }: HttpContext) {
		const payload = await request.validateUsing(orderingInterventionValidator);
		await this.interventionService.orderInterventions(payload);
		return response.redirect().toRoute("admin.organise.interventions");
	}
}
