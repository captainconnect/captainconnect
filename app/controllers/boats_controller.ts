import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { BoatService } from "#services/boat_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { ContactService } from "#services/contact_service";
import { boatValidator } from "#validators/boat";

@inject()
export default class BoatsController {
	constructor(
		protected boatService: BoatService,
		protected contactService: ContactService,
	) {}

	async index({ inertia }: HttpContext) {
		const boats = await this.boatService.getAll();
		return inertia.render("boats/index", {
			boats,
		});
	}

	async show({ params, inertia }: HttpContext) {
		const boatSlug = params.boatSlug;

		const boat = await this.boatService.getBySlug(boatSlug);

		return inertia.render("boats/show", {
			boat,
		});
	}

	async create({ inertia }: HttpContext) {
		const contacts = await this.contactService.getAll();
		const boatTypes = await this.boatService.getTypes();
		const boatConstructors = await this.boatService.getConstructors();

		return inertia.render("boats/create", {
			contacts,
			boatTypes,
			boatConstructors,
		});
	}

	async store({ request, response }: HttpContext) {
		const boatPayload = await request.validateUsing(boatValidator);
		const { slug } = await this.boatService.create(boatPayload);
		return response.redirect().toRoute("boats.show", {
			boatSlug: slug,
		});
	}

	async edit({ params, inertia }: HttpContext) {
		const boatSlug = params.boatSlug;
		const boat = await this.boatService.getBySlug(boatSlug);
		const contacts = await this.contactService.getAll();
		const boatTypes = await this.boatService.getTypes();
		const boatConstructors = await this.boatService.getConstructors();

		return inertia.render("boats/edit", {
			boat,
			contacts,
			boatTypes,
			boatConstructors,
		});
	}

	async update({ request, params, response }: HttpContext) {
		const boatSlug = params.boatSlug;
		const boat = await this.boatService.getBySlug(boatSlug);

		const payload = await request.validateUsing(boatValidator, {
			meta: { boat },
		});

		const slug = await this.boatService.update(payload, boat);
		return response.redirect().toRoute("boats.show", {
			boatSlug: slug,
		});
	}

	async destroy({ params, response }: HttpContext) {
		const boatSlug = params.boatSlug;
		await this.boatService.delete(boatSlug);
		return response.redirect().toRoute("boats.index");
	}
}
