import Boat from "#models/boat";
import BoatConstructor from "#models/boat_constructor";
import BoatType from "#models/boat_type";
import type { BoatPayload } from "#types/boat";

export class BoatService {
	async getAll() {
		return await Boat.query()
			.orderBy("name", "asc")
			.preload("boatConstructor")
			.preload("type")
			.preload("contact")
			.preload("interventions", (query) =>
				query.where("status", "IN_PROGRESS"),
			);
	}

	async getBySlug(slug: string) {
		return await Boat.query()
			.where("slug", slug)
			.preload("boatConstructor")
			.preload("type")
			.preload("contact")
			.preload("interventions")
			.firstOrFail();
	}

	async create(payload: BoatPayload) {
		return await Boat.create(payload);
	}

	async update(payload: BoatPayload, boat: Boat) {
		boat.merge(payload);
		const { slug } = await boat.save();
		return slug;
	}

	async delete(slug: string) {
		const boat = await Boat.findByOrFail("slug", slug);
		await boat.delete();
	}

	async getTypes() {
		return await BoatType.query().orderBy("label", "asc");
	}

	async getConstructors() {
		return await BoatConstructor.query().orderBy("name", "asc");
	}
}
