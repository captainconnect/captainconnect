import { BaseCommand } from "@adonisjs/core/ace";
import db from "@adonisjs/lucid/services/db";
import Task from "#models/task";
import TaskGroup from "#models/task_group";

export default class BackFillTaskOrder extends BaseCommand {
	static commandName = "backfill:task-order";
	static description =
		"Initialize order column for task per task groups per intervention";

	static options = {
		startApp: true,
	};

	async run() {
		this.logger.info("Starting backfill of tasks.order");

		await db.transaction(async (trx) => {
			// 1. récupérer toutes les interventions
			const interventions = await trx.from("interventions").select("id");

			this.logger.info(`Found ${interventions.length} interventions`);

			for (const intervention of interventions) {
				// 2. récupérer les groupes de l'intervention
				const groups = await TaskGroup.query({ client: trx })
					.where("intervention_id", intervention.id)
					.orderBy("id", "asc");

				for (const group of groups) {
					// 3. récupérer les tâches du groupe
					const tasks = await Task.query({ client: trx })
						.where("task_group_id", group.id)
						.orderBy("id", "asc");

					for (let index = 0; index < tasks.length; index++) {
						const task = tasks[index];

						if (task.sort !== index) {
							task.merge({ sort: index });
							await task.save(); // déjà dans la transaction
						}
					}

					this.logger.info(
						`Intervention ${intervention.id} / Group ${group.id}: ${tasks.length} tasks ordered`,
					);
				}
			}
		});

		this.logger.success("Task order backfill completed");
	}
}
