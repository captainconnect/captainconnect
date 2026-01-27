import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";
import Boat from "#models/boat";
import Intervention from "#models/intervention";
import TaskGroup from "#models/task_group";
import type {
	CreateInterventionPayload,
	OrderingInterventionsPayload,
	SuspendPayload,
	UpdateInterventionPayload,
} from "#types/intervention";
import {
	formatDate,
	formatDecimalHours,
	getInitials,
} from "../helpers/intervention.js";

export class InterventionService {
	async getBoatInterventions(boatId: number) {
		const rows = await Intervention.query()
			.where("boat_id", boatId)
			.preload("taskGroups", (query) => query.preload("tasks"))
			.orderBy("created_at", "desc");

		return rows.map((intervention) => ({
			id: intervention.id,
			title: intervention.title,
			tasks: intervention.taskGroups.flatMap((tg) =>
				tg.tasks.map((t) => ({
					id: t.id,
					name: t.name,
				})),
			),
		}));
	}

	async getInterventionsForOrder() {
		return await Intervention.query()
			.preload("boat")
			.whereNot("status", "DONE")
			.orderBy("order", "asc");
	}

	async orderInterventions(payload: OrderingInterventionsPayload) {
		const list = payload.interventions;
		if (!Array.isArray(list)) return;

		await db.transaction(async (trx) => {
			for (const item of list) {
				await Intervention.query({ client: trx })
					.where("id", item.id)
					.update({ order: item.index });
			}
		});
	}

	async getOpenInterventions(page: number, state?: string) {
		const query = Intervention.query()
			.preload("boat", (query) => query.preload("type").preload("thumbnail"))
			.preload("taskGroups", (query) => query.preload("tasks"))
			.orderBy("order", "asc");

		if (state) {
			query.andWhere("status", state);
		} else {
			query.whereNot("status", "DONE");
		}

		const rows = await query.paginate(page, 10);
		return {
			data: rows.all(),
			meta: rows.getMeta(),
		};
	}

	async getBySlug(slug: string) {
		return await Intervention.query()
			.where("slug", slug)
			.preload("boat", (query) =>
				query
					.preload("contact")
					.preload("boatConstructor")
					.preload("type")
					.preload("thumbnail"),
			)
			.preload("workDones", (query) => query.preload("hours")) // 👈 ICI
			.preload("taskGroups", (query) =>
				query
					.orderBy("sort", "asc")
					.preload("tasks", (query) =>
						query
							.orderBy("sort", "asc")
							.preload("workDones", (query) => query.preload("hours")),
					),
			)
			.withCount("medias")
			.firstOrFail();
	}

	async getTaskGroups(id: number) {
		return await TaskGroup.findManyBy("intervention_id", id);
	}

	async create(boatSlug: string, payload: CreateInterventionPayload) {
		const boat = await Boat.query().where("slug", boatSlug).firstOrFail();

		const intervention = await boat.related("interventions").create({
			title: payload.title,
			description: payload.description,
			startAt: payload.startAt,
			endAt: payload.endAt,
			priority: payload.priority,
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
			priority: payload.priority,
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
		intervention.suspensionReason = null;
		await intervention.save();
	}

	async suspend(slug: string, payload: SuspendPayload) {
		const intervention = await Intervention.findByOrFail("slug", slug);
		intervention.status = "SUSPENDED";
		intervention.suspensionReason = payload.reason;
		await intervention.save();
	}

	async delete(slug: string) {
		const intervention = await Intervention.findByOrFail("slug", slug);

		await intervention.delete();
	}

	async getForPDF(slug: string) {
		const intervention = await Intervention.query()
			.where("slug", slug)
			.preload("boat", (b) => b.preload("contact"))
			.preload("taskGroups", (tg) => {
				tg.orderBy("sort", "asc");
				tg.preload("tasks", (t) => {
					t.orderBy("sort", "asc");
					t.preload("workDones", (wd) => {
						wd.orderBy("date", "asc");
						wd.preload("hours", (h) => h.preload("user"));
					});
				});
			})
			.firstOrFail();

		// Objet pour accumuler le temps de travail réel par technicien
		const technicianTotals: Record<
			number,
			{ name: string; totalHours: number }
		> = {};

		// 1) Transformation des travaux demandés (Requested Works)
		const requestedWorks = intervention.taskGroups.map((tg) => ({
			id: tg.id,
			name: tg.name,
			tasks: tg.tasks.map((t) => ({
				id: t.id,
				name: t.name,
				status: t.status,
				details: t.details ?? null,
			})),
		}));

		// 2) Transformation des travaux effectués (Performed Works)
		const performedWorks = intervention.taskGroups.flatMap((tg) =>
			tg.tasks.flatMap((t) =>
				(t.workDones ?? []).map((wd) => {
					const hoursEntries = wd.hours ?? [];

					// --- LOGIQUE TABLEAU DU HAUT : Temps chronologique de la tâche ---
					// Si A et B travaillent 1h15 ensemble, la tâche a duré 1h15. On prend le Max.
					const maxLineHours =
						hoursEntries.length > 0
							? Math.max(...hoursEntries.map((h) => Number(h.count ?? 0)))
							: 0;

					const rowHoursFormatted =
						maxLineHours > 0 ? formatDecimalHours(maxLineHours) : "-";

					// --- LOGIQUE RÉCAPITULATIF : Charge de travail par technicien ---
					hoursEntries.forEach((h) => {
						if (h.user) {
							const userId = h.user.id;
							if (!technicianTotals[userId]) {
								technicianTotals[userId] = {
									name: `${h.user.firstname} ${h.user.lastname}` || "Inconnu",
									totalHours: 0,
								};
							}
							// On additionne les heures propres à chaque technicien
							technicianTotals[userId].totalHours += Number(h.count ?? 0);
						}
					});

					const users = hoursEntries.map((h) => h.user).filter(Boolean);
					const initials = Array.from(new Set(users.map(getInitials))).join(
						" ",
					);

					return {
						date: formatDate(wd.date),
						initials,
						workDone: wd.workDone ?? "",
						usedMaterials: wd.usedMaterials ?? "-",
						hours: rowHoursFormatted, // Temps de la tâche (Max)
						taskGroupName: tg.name,
						taskName: t.name,
					};
				}),
			),
		);

		// 3) Construction du tableau récapitulatif des techniciens
		const technicianTable = Object.values(technicianTotals)
			.map((tech) => ({
				name: tech.name,
				total: formatDecimalHours(tech.totalHours),
				rawHours: tech.totalHours,
			}))
			.sort((a, b) => b.rawHours - a.rawHours); // Tri par importance de charge

		// Tri chronologique final des lignes du tableau principal
		performedWorks.sort((a, b) => {
			const da = DateTime.fromFormat(a.date, "dd/LL/yyyy").toMillis();
			const db = DateTime.fromFormat(b.date, "dd/LL/yyyy").toMillis();
			return da - db;
		});

		// ✅ OBJET FINAL RETOURNÉ
		return {
			title: intervention.title,
			meta: {
				slug: intervention.slug,
				status: intervention.status,
				priority: intervention.priority,
				progress: intervention.progress,
			},
			boat: {
				name: intervention.boat?.name ?? null,
				contact: intervention.boat?.contact
					? {
							name: intervention.boat.contact.fullName ?? null,
							email: intervention.boat.contact.email ?? null,
							phone: intervention.boat.contact.phone ?? null,
						}
					: null,
			},
			requestedWorks,
			performedWorks,
			technicianTable,
		};
	}
}
