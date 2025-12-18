import db from "@adonisjs/lucid/services/db";
import Hour from "#models/hour";
import Intervention from "#models/intervention";
import Task from "#models/task";
import TaskGroup from "#models/task_group";
import type {
	CreateTaskPayload,
	OrderTaskPayload,
	UpdateTaskPayload,
} from "#types/intervention";

export class TaskService {
	async getById(id: number) {
		return await Task.query()
			.where("id", id)
			.preload("taskGroup", (q) => q.preload("intervention"))
			.preload("workDones", (q) => {
				// 👇 une seule valeur métier
				q.orderBy("date", "desc");
				q.withAggregate("hours", (sub) => {
					sub.max("count").as("count");
				});

				// 👇 tous les participants
				q.preload("hours", (hq) => {
					hq.preload("user");
				});
			})
			.firstOrFail();
	}

	async create(payload: CreateTaskPayload, interventionSlug: string) {
		const intervention = await Intervention.findByOrFail(
			"slug",
			interventionSlug,
		);

		let taskGroup: TaskGroup | undefined;

		if (payload.taskGroup) {
			taskGroup = await TaskGroup.create({
				interventionId: intervention.id,
				name: payload.taskGroup,
			});
		} else if (payload.taskGroupId) {
			taskGroup = await TaskGroup.findOrFail(payload.taskGroupId);
		}

		if (!taskGroup) {
			throw new Error("Aucun groupe de tâches spécifié.");
		}

		await taskGroup.related("tasks").create({
			name: payload.name,
		});
	}

	async update(
		payload: UpdateTaskPayload,
		interventionId: number,
		taskId: number,
	) {
		const task = await Task.query()
			.where("id", taskId)
			.whereHas("taskGroup", (q) => {
				q.where("intervention_id", interventionId);
			})
			.preload("taskGroup")
			.firstOrFail();

		const oldTaskGroupId = task.taskGroupId;

		task.merge(payload);
		await task.save();

		// Si le task_group a changé, on vérifie l'ancien
		if (payload.taskGroupId && payload.taskGroupId !== oldTaskGroupId) {
			const remainingTasksCount = await Task.query()
				.where("task_group_id", oldTaskGroupId)
				.count("* as total");

			if (Number(remainingTasksCount[0].$extras.total) === 0) {
				await TaskGroup.query().where("id", oldTaskGroupId).delete();
			}
		}
	}

	// async getHours(id: number) {
	// 	return await Hour.query().where("task_id", id).preload("user");
	// }

	// async addHour({ userId, date, count }: AddHourPayload, taskId: number) {
	// 	await Hour.create({
	// 		userId,
	// 		taskId,
	// 		date,
	// 		count,
	// 	});
	// }

	async check(id: number) {
		const task = await Task.findOrFail(id);
		task.status = "DONE";
		await task.save();
	}

	async uncheck(id: number) {
		const task = await Task.findOrFail(id);
		task.status = "IN_PROGRESS";
		await task.save();
	}

	// async updateDetails(payload: TaskDetailsPayload, id: number) {
	// 	const task = await Task.findOrFail(id);
	// 	task.details = payload.details;
	// 	await task.save();
	// }

	async deleteHour(id: number) {
		const hour = await Hour.findOrFail(id);
		await hour.delete();
	}

	async orderTasks(interventionSlug: string, payload: OrderTaskPayload) {
		const intervention = await Intervention.query()
			.where("slug", interventionSlug)
			.firstOrFail();

		await db.transaction(async (trx) => {
			for (let i = 0; i < payload.groups.length; i++) {
				const group = payload.groups[i];

				// update ordre du groupe
				await TaskGroup.query({ client: trx })
					.where("id", group.id)
					.where("intervention_id", intervention.id)
					.update({ sort: i });

				for (let j = 0; j < group.tasks.length; j++) {
					const task = group.tasks[j];

					// update ordre de la tâche
					await Task.query({ client: trx }).where("id", task.id).update({
						sort: j,
						taskGroupId: group.id,
					});
				}
			}
		});
	}

	async delete(id: number) {
		const task = await Task.query()
			.where("id", id)
			.preload("taskGroup", (q) => q.preload("tasks"))
			.firstOrFail();

		if (task.taskGroup.tasks.length <= 1) {
			const taskGroup = await TaskGroup.findOrFail(task.taskGroup.id);
			await taskGroup.delete();
		} else {
			await task.delete();
		}
	}
}
