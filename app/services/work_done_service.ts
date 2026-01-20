import db from "@adonisjs/lucid/services/db";
import Hour from "#models/hour";
import Task from "#models/task";
import WorkDone from "#models/work_done";
import type { WorkDonePayload } from "#types/workdone";

export class WorkDoneService {
	async create(
		interventionId: number,
		taskId: number,
		payload: WorkDonePayload,
	) {
		const work_done = await WorkDone.create({
			interventionId,
			taskId,
			date: payload.date,
			workDone: payload.work_done,
			usedMaterials: payload.used_materials || null,
		});

		await Hour.createMany(
			payload.technician_ids.map((id) => {
				return {
					userId: id,
					taskId,
					count: payload.hour_count,
					workDoneId: work_done.id,
				};
			}),
		);
	}

	async update(workdoneId: number, payload: WorkDonePayload) {
		return await db.transaction(async (trx) => {
			const workdone = await WorkDone.query({ client: trx })
				.where("id", workdoneId)
				.firstOrFail();

			// 1) update WorkDone (mappe bien snake -> camel si besoin)
			workdone.merge({
				date: payload.date,
				workDone: payload.work_done,
				usedMaterials: payload.used_materials || null,
				// ⚠️ ne merge PAS technician_ids / hour_count si ça n'existe pas sur WorkDone
			});

			await workdone.save();

			// 2) récupérer les heures existantes pour CE workdone
			const existingHours = await Hour.query({ client: trx }).where(
				"workDoneId",
				workdoneId,
			);

			const existingUserIds = new Set(existingHours.map((h) => h.userId));
			const nextUserIds = new Set(payload.technician_ids);

			const toDelete = [...existingUserIds].filter(
				(id) => !nextUserIds.has(id),
			);
			const toAdd = [...nextUserIds].filter((id) => !existingUserIds.has(id));
			const toKeep = [...nextUserIds].filter((id) => existingUserIds.has(id));

			// 3) supprimer ceux qui n'y sont plus
			if (toDelete.length) {
				await Hour.query({ client: trx })
					.where("workDoneId", workdoneId)
					.whereIn("userId", toDelete)
					.delete();
			}

			// 4) ajouter les nouveaux
			if (toAdd.length) {
				await Hour.createMany(
					toAdd.map((userId) => ({
						userId,
						taskId: workdone.taskId,
						count: payload.hour_count,
						workDoneId: workdoneId,
					})),
					{ client: trx },
				);
			}

			// 5) (recommandé) mettre à jour le count pour ceux conservés
			// si ton modèle = 1 ligne Hour par technicien et workdone.
			if (toKeep.length) {
				await Hour.query({ client: trx })
					.where("workDoneId", workdoneId)
					.whereIn("userId", toKeep)
					.update({ count: payload.hour_count });
			}

			return workdone;
		});
	}

	async delete(workdoneId: number, taskId: number) {
		const workdone = await WorkDone.findOrFail(workdoneId);

		await workdone.delete();

		const remaining = await WorkDone.query().where("task_id", taskId);

		if (remaining.length === 0) {
			const task = await Task.findOrFail(taskId);
			task.status = "IN_PROGRESS"; // adapte si enum
			await task.save();
		}
	}
}
