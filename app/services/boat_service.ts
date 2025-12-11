import Boat from "#models/boat";
import BoatConstructor from "#models/boat_constructor";
import BoatType from "#models/boat_type";
import type { BoatPayload, Coordinate } from "#types/boat";

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
		const hadPlace =
			!!boat.place && boat.place.trim().length > 0 && boat.place !== "Manuelle";
		const hadPosition = !!boat.position;

		const payloadPlace = payload.place?.trim() ?? "";

		const hasPlace = payloadPlace.length > 0 && payloadPlace !== "Manuelle";

		const hasPosition =
			Array.isArray(payload.position) && payload.position.length === 2;

		if (!hasPlace && !hasPosition) {
			boat.place = null;
			boat.position = null;
		} else if (hadPlace && hasPosition) {
			boat.position = payload.position as Coordinate;
			boat.place = "Manuelle";
		} else if (hadPosition && hasPlace) {
			boat.position = null;
			boat.place = payloadPlace;
		} else if (hasPlace) {
			boat.place = payloadPlace;
			boat.position = null;
		} else if (hasPosition) {
			boat.position = payload.position as Coordinate;
			boat.place = "Manuelle";
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
