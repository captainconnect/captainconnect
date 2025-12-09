import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Boat from "#models/boat";
import Intervention from "#models/intervention";
import Task from "#models/task";
import TaskGroup from "#models/task_group";

export default class InterventionSeeder extends BaseSeeder {
	public static environment = ["development", "testing"];

	async run() {
		const boats = await Boat.all();

		const titles = [
			"Révision moteur",
			"Contrôle tableau électrique",
			"Diagnostic chargeur de quai",
			"Révision guindeau",
			"Changement parc batteries",
			"Recherche panne 12V",
			"Installation éclairage LED",
			"Vérification propulseur d’étrave",
			"Réparation pilote automatique",
			"Révision pompe de cale",
		];

		const priorities = ["LOW", "NORMAL", "HIGH", "EXTREME"] as const;
		const statuses = ["SUSPENDED", "IN_PROGRESS", "DONE"] as const;

		for (const boat of boats) {
			const nbInterventions = Math.floor(Math.random() * 3) + 2; // 2–4 interventions

			for (let i = 0; i < nbInterventions; i++) {
				const title = titles[Math.floor(Math.random() * titles.length)];
				const status = statuses[Math.floor(Math.random() * statuses.length)];
				const priority =
					priorities[Math.floor(Math.random() * priorities.length)];

				// Dates cohérentes suivant le statut
				let startAt: Date | null = null;
				let endAt: Date | null = null;

				if (status === "IN_PROGRESS") {
					startAt = new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000);
				}

				if (status === "DONE") {
					startAt = new Date(
						Date.now() - Math.random() * 14 * 24 * 3600 * 1000,
					);
					endAt = new Date(
						startAt.getTime() + (Math.random() * 5 + 1) * 3600 * 1000,
					);
				}

				const intervention = await Intervention.create({
					boatId: boat.id,
					title,
					description: `Intervention '${title}' réalisée sur le bateau ${boat.name}.`,
					status,
					priority,
					startAt,
					endAt,
				});

				// Création TaskGroups
				const nbGroups = Math.floor(Math.random() * 3) + 1; // 1–3 groupes

				for (let g = 0; g < nbGroups; g++) {
					const group = await TaskGroup.create({
						interventionId: intervention.id,
						name: `Groupe ${g + 1}`,
					});

					// Création Tasks
					const nbTasks = Math.floor(Math.random() * 4) + 2; // 2–5 tâches
					for (let t = 0; t < nbTasks; t++) {
						await Task.create({
							taskGroupId: group.id,
							name: `Tâche ${t + 1} du groupe ${g + 1}`,
							status: Math.random() < 0.6 ? "IN_PROGRESS" : "DONE",
						});
					}
				}
			}
		}

		console.log("✔ Interventions + TaskGroups + Tasks générées");
	}
}
