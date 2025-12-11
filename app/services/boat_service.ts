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
		return await Boat.create({
			...payload,
			...(payload.position
				? {
						place: "Manuelle",
						position: [payload.position[0], payload.position[1]],
					}
				: {}),
		});
	}

	async update(payload: BoatPayload, boat: Boat) {
		const hadPlace = !!boat.place;
		const hadPosition = !!boat.position;

		const hasPayloadPosition =
			Array.isArray(payload.position) && payload.position.length === 2;
		const hasPayloadPlace =
			typeof payload.place === "string" && payload.place.trim() !== "";

		if (hadPlace && hasPayloadPosition) {
			boat.position = payload.position ?? null;
			boat.place = "Manuelle";
		}

		if (hadPosition && hasPayloadPlace) {
			boat.place = payload.place ?? "";
			boat.position = null;
		}

		boat.merge({
			...payload,
			position: boat.position,
			place: boat.place,
		});

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
