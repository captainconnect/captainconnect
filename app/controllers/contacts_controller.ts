import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { ContactService } from "#services/contact_service";
import { contactValidator } from "#validators/contact";

@inject()
export default class ContactsController {
	constructor(protected contactService: ContactService) {}

	async index({ inertia }: HttpContext) {
		const contacts = await this.contactService.getAll();
		return inertia.render("contacts/index", {
			contacts,
		});
	}

	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(contactValidator);
		await this.contactService.create(payload);
		return response.redirect().back();
	}

	async update({ params, request, response }: HttpContext) {
		const contactId = params.contactId;
		const payload = await request.validateUsing(contactValidator);
		await this.contactService.update(contactId, payload);
		return response.redirect().back();
	}

	async destroy({ params, response }: HttpContext) {
		const contactId = params.contactId;
		await this.contactService.delete(contactId);
		return response.redirect().back();
	}
}
