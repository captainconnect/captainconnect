import Contact from "#models/contact";
import type { ContactPayload } from "#types/contact";

export class ContactService {
	async getAll() {
		return await Contact.query().orderBy("fullName", "asc");
	}

	async create(payload: ContactPayload) {
		return await Contact.create(payload);
	}

	async update(id: number, payload: ContactPayload) {
		const contact = await Contact.findOrFail(id);
		contact.merge({
			fullName: payload.fullName,
			company: payload.company ?? null,
			email: payload.email ?? null,
			phone: payload.phone ?? null,
			note: payload.note ?? null,
		});
		await contact.save();
	}

	async delete(id: number) {
		const contact = await Contact.findOrFail(id);
		await contact.delete();
	}
}
