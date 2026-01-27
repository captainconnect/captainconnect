import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Boat from "#models/boat";
import Intervention from "#models/intervention";
import Task from "#models/task";
import TaskGroup from "#models/task_group";
import WorkDone from "#models/work_done";

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

		const suspensionReasons = [
			"En attente de validation client",
			"Commande pièces en cours",
			"Accès au bateau impossible",
			"En attente d'informations complémentaires",
			"Intervention reportée (météo / dispo)",
		];

		const workDoneSamples = [
			"Contrôle visuel + mesures, diagnostic posé.",
			"Démontage partiel, nettoyage et remontage.",
			"Remplacement composant, tests OK.",
			"Resserrage/sertissage, vérification continuité.",
			"Essais en charge, validation fonctionnement.",
		];

		const materials = [
			"Fusibles 12V",
			"Cosses + gaine thermo",
			"Ruban isolant",
			"Serre-câbles",
			"Connecteurs étanches",
			"Aucun",
		];

		const priorities = ["LOW", "NORMAL", "HIGH", "EXTREME"] as const;
		const interventionStatuses = ["SUSPENDED", "IN_PROGRESS", "DONE"] as const;

		for (const boat of boats) {
			const nbInterventions = Math.floor(Math.random() * 3) + 2; // 2–4

			for (let i = 0; i < nbInterventions; i++) {
				const title = titles[Math.floor(Math.random() * titles.length)];
				const status =
					interventionStatuses[
						Math.floor(Math.random() * interventionStatuses.length)
					];
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

				const suspensionReason =
					status === "SUSPENDED"
						? suspensionReasons[
								Math.floor(Math.random() * suspensionReasons.length)
							]
						: null;

				const intervention = await Intervention.create({
					boatId: boat.id,
					title,
					description: `Intervention '${title}' réalisée sur le bateau ${boat.name}.`,
					status,
					priority,
					startAt,
					endAt,
					suspensionReason,
				});

				// TaskGroups
				const nbGroups = Math.floor(Math.random() * 3) + 1; // 1–3

				for (let g = 0; g < nbGroups; g++) {
					const group = await TaskGroup.create({
						interventionId: intervention.id,
						name: `Groupe ${g + 1}`,
						sort: g + 1,
					});

					// Tasks
					const nbTasks = Math.floor(Math.random() * 4) + 2; // 2–5

					for (let t = 0; t < nbTasks; t++) {
						const sort = t + 1;

						// --- Statut task (sans SUSPENDED) + suspension_reason optionnelle ---
						// Règles:
						// - si task.status = DONE => pas de suspensionReason + WorkDone obligatoire
						// - si suspensionReason != null => status = IN_PROGRESS
						let shouldSuspend = false;

						// Interventions SUSPENDED => beaucoup de tâches suspendues
						if (intervention.status === "SUSPENDED") {
							shouldSuspend = Math.random() < 0.6;
						} else if (intervention.status === "IN_PROGRESS") {
							shouldSuspend = Math.random() < 0.15;
						} else {
							// Intervention DONE => très peu de tâches suspendues (voire jamais)
							shouldSuspend = Math.random() < 0.03;
						}

						const suspensionReasonTask = shouldSuspend
							? suspensionReasons[
									Math.floor(Math.random() * suspensionReasons.length)
								]
							: null;

						// statut: si suspendue => IN_PROGRESS, sinon DONE/IN_PROGRESS selon contexte
						let taskStatus: "IN_PROGRESS" | "DONE" = "IN_PROGRESS";

						if (!suspensionReasonTask) {
							if (intervention.status === "DONE") {
								taskStatus = Math.random() < 0.85 ? "DONE" : "IN_PROGRESS";
							} else if (intervention.status === "IN_PROGRESS") {
								taskStatus = Math.random() < 0.45 ? "DONE" : "IN_PROGRESS";
							} else {
								// intervention suspendue mais task pas suspendue => plutôt in progress
								taskStatus = Math.random() < 0.2 ? "DONE" : "IN_PROGRESS";
							}
						}

						const task = await Task.create({
							taskGroupId: group.id,
							name: `Tâche ${t + 1} du groupe ${g + 1}`,
							status: taskStatus,
							sort,
							suspensionReason: suspensionReasonTask,
						});

						// ✅ Règle: DONE => WorkDone obligatoire
						if (task.status === "DONE") {
							const nbWorkDones = Math.floor(Math.random() * 2) + 1; // 1–2

							for (let w = 0; w < nbWorkDones; w++) {
								const workDateBase =
									intervention.endAt ??
									intervention.startAt ??
									new Date(Date.now() - Math.random() * 10 * 24 * 3600 * 1000);

								const date = new Date(
									workDateBase.getTime() - Math.random() * 3 * 24 * 3600 * 1000,
								);

								await WorkDone.create({
									taskId: task.id,
									interventionId: intervention.id,
									workDone:
										workDoneSamples[
											Math.floor(Math.random() * workDoneSamples.length)
										],
									usedMaterials:
										materials[Math.floor(Math.random() * materials.length)],
									date,
								});
							}
						}
					}
				}
			}
		}

		console.log(
			"✔ Interventions + TaskGroups + Tasks générées (DONE => WorkDone, suspension => reason)",
		);
	}
}
