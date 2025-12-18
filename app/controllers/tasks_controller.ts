import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { TaskService } from "#services/task_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import {
	createTaskValidator,
	orderTasksValidator,
	updateTaskValidator,
} from "#validators/task";

@inject()
export default class TasksController {
	constructor(
		protected taskService: TaskService,
		protected userService: UserService,
		protected interventionService: InterventionService,
	) {}

	async index({ params, inertia }: HttpContext) {
		const interventionSlug = params.interventionSlug;

		const intervention =
			await this.interventionService.getBySlug(interventionSlug);

		return inertia.render("interventions/tasks/index", {
			intervention,
		});
	}

	async show({ params, inertia }: HttpContext) {
		const taskId = params.taskId;
		const interventionSlug = params.interventionSlug;
		const { id } = await this.interventionService.getBySlug(interventionSlug);
		const taskGroups = await this.interventionService.getTaskGroups(id);
		const task = await this.taskService.getById(taskId);
		const users = await this.userService.getAllForTask();

		return inertia.render("interventions/tasks/show", {
			task,
			users,
			interventionSlug,
			taskGroups,
		});
	}

	async store({ params, request, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		const payload = await request.validateUsing(createTaskValidator);

		await this.taskService.create(payload, interventionSlug);
		return response.redirect().back();
	}

	async update({ params, request, response }: HttpContext) {
		const { taskId, interventionSlug } = params;
		const { id } = await this.interventionService.getBySlug(interventionSlug);
		const payload = await request.validateUsing(updateTaskValidator);
		await this.taskService.update(payload, id, taskId);
		return response.redirect().back();
	}

	// async addHour({ params, request, response }: HttpContext) {
	// 	const taskId = params.taskId;

	// 	const payload = await request.validateUsing(hourValidator);

	// 	await this.taskService.addHour(payload, taskId);

	// 	return response.redirect().back();
	// }

	async checkTask({ params, response }: HttpContext) {
		const taskId = params.taskId;

		await this.taskService.check(taskId);

		return response.redirect().back();
	}

	async uncheckTask({ params, response }: HttpContext) {
		const taskId = params.taskId;

		this.taskService.uncheck(taskId);

		return response.redirect().back();
	}

	// async updateDetails({ params, request, response }: HttpContext) {
	// 	const taskId = params.taskId;

	// 	const payload = await request.validateUsing(taskDetailsValidator);

	// 	this.taskService.updateDetails(payload, taskId);
	// 	return response.redirect().back();
	// }

	// async destroyHour({ params, response }: HttpContext) {
	// 	const hourId = params.hourId;
	// 	await this.taskService.deleteHour(hourId);
	// 	return response.redirect().back();
	// }

	async order({ params, request, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		const payload = await request.validateUsing(orderTasksValidator);
		await this.taskService.orderTasks(interventionSlug, payload);
		return response.redirect().back();
	}

	async destroy({ params, response }: HttpContext) {
		const taskId = params.taskId;
		const interventionSlug = params.interventionSlug;
		await this.taskService.delete(taskId);
		return response.redirect().toRoute("interventions.tasks.index", {
			interventionSlug,
		});
	}
}
