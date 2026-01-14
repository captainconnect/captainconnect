import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { BoatService } from "#services/boat_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { MediaService } from "#services/media_service";
import {
	massProjectMediaDeleteValidator,
	massProjectMediaValidator,
	projectMediaValidator,
} from "#validators/media";

@inject()
export default class MediaController {
	constructor(
		protected mediaService: MediaService,
		protected boatService: BoatService,
		protected interventionService: InterventionService,
	) {}

	async index({ inertia }: HttpContext) {
		const boats = await this.boatService.getForMediaList();
		return inertia.render("medias/index", {
			boats,
		});
	}

	async show({ request, params, inertia }: HttpContext) {
		const page = request.input("page", 1);
		const interventionId = request.input("intervention_id");
		const taskId = request.input("task_id");
		const boatSlug = params.boatSlug;
		const boat = await this.boatService.getBySlug(boatSlug);
		const interventions = await this.interventionService.getBoatInterventions(
			boat.id,
		);
		const { data, meta } = await this.mediaService.get(
			boat.id,
			page,
			interventionId,
			taskId,
		);
		return inertia.render("medias/show", {
			medias: data,
			boat,
			meta,
			interventions,
		});
	}

	async storeProjectMedia({ auth, request, response }: HttpContext) {
		const { id } = await auth.authenticate();
		const payload = await request.validateUsing(projectMediaValidator);
		const boatSlug = await this.boatService.getSlug(payload.boatId);
		await this.mediaService.create(payload, id, boatSlug);
		return response.redirect().back();
	}

	async storeMassProjectMedia({ auth, request, response }: HttpContext) {
		const { id } = await auth.authenticate();
		const payload = await request.validateUsing(massProjectMediaValidator);
		const boatSlug = await this.boatService.getSlug(payload.boatId);
		await this.mediaService.createMany(payload, id, boatSlug);
		return response.redirect().back();
	}

	async deleteManyProjectMedia({ request, response }: HttpContext) {
		const payload = await request.validateUsing(
			massProjectMediaDeleteValidator,
		);
		await this.mediaService.deleteMany(payload.projectMediaIds);
		return response.redirect().back();
	}

	async deleteProjectMedia({ params, response }: HttpContext) {
		const projectMediaId = params.projectMediaId;
		await this.mediaService.delete(projectMediaId);
		return response.redirect().back();
	}
}
