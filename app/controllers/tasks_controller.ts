import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { TaskService } from "#services/task_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { UserService } from "#services/user_service";
import { hourValidator } from "#validators/hour";
import { createTaskValidator, taskDetailsValidator } from "#validators/task";

@inject()
export default class TasksController {
	constructor(
		protected taskService: TaskService,
		protected userService: UserService,
	) {}

	async show({ params, inertia }: HttpContext) {
		const taskId = params.taskId;
		const interventionSlug = params.interventionSlug;

		const task = await this.taskService.getById(taskId);
		const users = await this.userService.getAllForTask();
		const hours = await this.taskService.getHours(taskId);

		return inertia.render("interventions/tasks/show", {
			task,
			users,
			hours,
			interventionSlug,
		});
	}

	async store({ params, request, response }: HttpContext) {
		const interventionSlug = params.interventionSlug;
		const payload = await request.validateUsing(createTaskValidator);

		await this.taskService.create(payload, interventionSlug);
		return response.redirect().back();
	}

	async addHour({ params, request, response }: HttpContext) {
		const taskId = params.taskId;

		const payload = await request.validateUsing(hourValidator);

		await this.taskService.addHour(payload, taskId);

		return response.redirect().back();
	}

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

	async updateDetails({ params, request, response }: HttpContext) {
		const taskId = params.taskId;

		const payload = await request.validateUsing(taskDetailsValidator);

		this.taskService.updateDetails(payload, taskId);
		return response.redirect().back();
	}

	async destroyHour({ params, response }: HttpContext) {
		const hourId = params.hourId;
		await this.taskService.deleteHour(hourId);
		return response.redirect().back();
	}

	async destroy({ params, response }: HttpContext) {
		const taskId = params.taskId;
		const interventionSlug = params.interventionSlug;
		await this.taskService.delete(taskId);
		return response.redirect().toRoute("interventions.show", {
			interventionSlug,
		});
	}
}
