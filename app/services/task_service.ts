import Hour from "#models/hour";
import Intervention from "#models/intervention";
import Task from "#models/task";
import TaskGroup from "#models/task_group";
import type {
	AddHourPayload,
	CreateTaskPayload,
	TaskDetailsPayload,
} from "#types/intervention";

export class TaskService {
	async getById(id: number) {
		return await Task.query()
			.where("id", id)
			.preload("taskGroup", (q) => q.preload("intervention"))
			.preload("hours")
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

	async getHours(id: number) {
		return await Hour.query().where("task_id", id).preload("user");
	}

	async addHour({ userId, date, count }: AddHourPayload, taskId: number) {
		await Hour.create({
			userId,
			taskId,
			date,
			count,
		});
	}

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

	async updateDetails(payload: TaskDetailsPayload, id: number) {
		const task = await Task.findOrFail(id);
		task.details = payload.details;
		await task.save();
	}

	async deleteHour(id: number) {
		const hour = await Hour.findOrFail(id);
		await hour.delete();
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
