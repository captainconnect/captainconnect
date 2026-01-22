import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

// biome-ignore lint/style/useImportType: IoC runtime needs this
import { BoatService } from "#services/boat_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { MediaService } from "#services/media_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import {
	createInterventionValidator,
	suspendInterventionValidator,
	updateInterventionValidator,
} from "#validators/intervention";

@inject()
export default class InterventionsController {
	constructor(
		protected interventionService: InterventionService,
		protected boatService: BoatService,
		protected userService: UserService,
		protected mediaService: MediaService,
	) {}

	async index({ request, inertia }: HttpContext) {
		const page = request.input("page", 1);
		const sort = request.input("sort", "priority");
		const state = request.input("state");
		const { data, meta } = await this.interventionService.getOpenInterventions(
			page,
			sort,
			state,
		);

		return inertia.render("interventions/index", {
			interventions: data,
			meta: meta,
			page,
		});
	}

	async show({ params, inertia }: HttpContext) {
		const interventionSlug = params.interventionSlug;

		const intervention =
			await this.interventionService.getBySlug(interventionSlug);

		return inertia.render("interventions/show", {
			intervention,
			mediasCount: intervention.$extras.medias_count,
		});
	}

	async create({ params, inertia }: HttpContext) {
		const boatSlug = params.boatSlug;

		const boat = await this.boatService.getBySlug(boatSlug);

		return inertia.render("interventions/create", {
			boat,
		});
	}

	async store({ params, request, response }: HttpContext) {
		const boatSlug = params.boatSlug;

		const payload = await request.validateUsing(createInterventionValidator);
		const slug = await this.interventionService.create(boatSlug, payload);

		return response.redirect().toRoute("interventions.show", {
			interventionSlug: slug,
		});
	}

	async edit({ params, inertia }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		const intervention =
			await this.interventionService.getBySlug(interventionSlug);
		return inertia.render("interventions/edit", {
			intervention,
		});
	}

	async update({ params, request, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;

		const payload = await request.validateUsing(updateInterventionValidator);

		await this.interventionService.update(interventionSlug, payload);
		return response.redirect().toRoute("interventions.show", {
			interventionSlug,
		});
	}

	async close({ params, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;

		await this.interventionService.close(interventionSlug);

		return response.redirect().back();
	}

	async suspend({ request, params, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		const payload = await request.validateUsing(suspendInterventionValidator);
		await this.interventionService.suspend(interventionSlug, payload);
		return response.redirect().toRoute("interventions.index");
	}

	async resume({ params, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		await this.interventionService.resume(interventionSlug);
		return response.redirect().back();
	}

	async destroy({ params, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;

		await this.interventionService.delete(interventionSlug);

		return response.redirect().toRoute("interventions.index");
	}
}
