import Boat from "#models/boat";
import Intervention from "#models/intervention";

import type {
	CreateInterventionPayload,
	UpdateInterventionPayload,
} from "#types/intervention";

export class InterventionService {
	async getOpenInterventions() {
		return await Intervention.query()
			.whereNot("status", "DONE")
			.orderBy("endAt", "desc")
			.preload("boat")
			.preload("taskGroups", (query) => query.preload("tasks"));
	}

	async getBySlug(slug: string) {
		return await Intervention.query()
			.where("slug", slug)
			.preload("boat", (query) =>
				query.preload("contact").preload("boatConstructor").preload("type"),
			)
			.preload("taskGroups", (query) =>
				query
					.orderBy("sort", "asc")
					.preload("tasks", (query) => query.orderBy("sort", "asc")),
			)
			.firstOrFail();
	}

	async create(boatSlug: string, payload: CreateInterventionPayload) {
		const boat = await Boat.query().where("slug", boatSlug).firstOrFail();

		const intervention = await boat.related("interventions").create({
			title: payload.title,
			description: payload.description,
			startAt: payload.startAt,
			endAt: payload.endAt,
		});

		for (const taskGroup of payload.taskGroups) {
			const tg = await intervention.related("taskGroups").create(taskGroup);
			await tg.related("tasks").createMany(taskGroup.tasks);
		}

		return intervention.slug;
	}

	async update(slug: string, payload: UpdateInterventionPayload) {
		const intervention = await Intervention.query()
			.where("slug", slug)
			.preload("taskGroups", (q) => q.preload("tasks"))
			.firstOrFail();

		intervention.merge({
			title: payload.title,
			description: payload.description,
			startAt: payload.startAt,
			endAt: payload.endAt,
		});

		const newSlug = (await intervention.save()).slug;

		return newSlug;
	}

	async close(slug: string) {
		const intervention = await Intervention.findByOrFail("slug", slug);
		intervention.status = "DONE";
		await intervention.save();
	}

	async resume(slug: string) {
		const intervention = await Intervention.findByOrFail("slug", slug);
		intervention.status = "IN_PROGRESS";
		await intervention.save();
	}

	async suspend(slug: string) {
		const intervention = await Intervention.findByOrFail("slug", slug);
		intervention.status = "SUSPENDED";
		await intervention.save();
	}

	async delete(slug: string) {
		const intervention = await Intervention.findByOrFail("slug", slug);

		await intervention.delete();
	}
}
