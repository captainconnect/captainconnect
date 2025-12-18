import { BaseCommand } from "@adonisjs/core/ace";
import db from "@adonisjs/lucid/services/db";
import TaskGroup from "#models/task_group";

export default class BackFillTaskGroupOrder extends BaseCommand {
	static commandName = "backfill:task-group-order";
	static description =
		"Initialize order column for task groups per intervention";

	static options = {
		startApp: true,
	};

	async run() {
		this.logger.info("Starting backfill of task_groups.order");

		await db.transaction(async (trx) => {
			// 1. récupérer toutes les interventions
			const interventions = await trx.from("interventions").select("id");

			this.logger.info(`Found ${interventions.length} interventions`);

			for (const intervention of interventions) {
				// 2. récupérer les groupes de l'intervention
				const groups = await TaskGroup.query({ client: trx })
					.where("intervention_id", intervention.id)
					.orderBy("id", "asc");

				// 3. assigner l'ordre
				for (let index = 0; index < groups.length; index++) {
					const group = groups[index];

					if (group.sort !== index) {
						group.sort = index;
						await group.save();
					}
				}

				this.logger.info(
					`Intervention ${intervention.id}: ${groups.length} groups ordered`,
				);
			}
		});

		this.logger.success("Task group order backfill completed");
	}
}
