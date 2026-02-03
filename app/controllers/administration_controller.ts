import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import DashboardVersion from "#models/dashboard_version";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { PushService } from "#services/push_service";
import { orderingInterventionValidator } from "#validators/intervention";

@inject()
export default class AdministrationController {
	constructor(
		protected interventionService: InterventionService,
		protected pushService: PushService,
	) {}

	async index({ inertia }: HttpContext) {
		return inertia.render("administration/index");
	}

	async dashboard({ request, inertia }: HttpContext) {
		const versions = await DashboardVersion.query().orderBy(
			"created_at",
			"desc",
		);
		const selectedVersionId = request.input("version_id");

		const currentVersion = selectedVersionId
			? await DashboardVersion.find(selectedVersionId)
			: versions[0];

		return inertia.render("administration/DashboardEditor", {
			versions,
			currentVersion,
		});
	}

	/**
	 * CRÉER une nouvelle version
	 */
	async dashboardStore({ request, response }: HttpContext) {
		const data = request.only(["content"]);

		// Génération du nom formaté : "27/01/2026 20:15"
		const now = new Date();
		const formattedName = `Version du ${now.toLocaleDateString("fr-FR")} à ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

		await DashboardVersion.create({
			name: formattedName,
			content: data.content,
		});

		return response.redirect().back();
	}

	/**
	 * METTRE À JOUR (Écraser) une version existante
	 */
	async dashboardUpdate({ params, request, response }: HttpContext) {
		const dashboardId = params.dashboardId;
		const { content } = request.only(["content"]);

		const version = await DashboardVersion.findOrFail(dashboardId);

		// On met à jour uniquement le contenu
		version.content = content;

		// Optionnel : Si tu veux aussi mettre à jour le nom pour refléter
		// l'heure de la dernière modification "écrasée" :
		// const now = new Date();
		// version.name = `Version du ${now.toLocaleDateString('fr-FR')} (MàJ à ${now.toLocaleTimeString('fr-FR')})`;

		await version.save();

		await this.pushService.notifyAll({
			title: "Cap'tain Connect",
			body: `Nouvelles consignes du jour publiées`,
			data: { url: "/" },
			icon: "/icons/icon-192.png",
		});

		return response.redirect().back();
	}

	/**
	 * Publier une version (Transactionnelle)
	 */
	async dashboardPublish({ params, response }: HttpContext) {
		const dashboardId = params.dashboardId;

		await db.transaction(async (trx) => {
			// 1. On passe tout le monde à false
			await DashboardVersion.query({ client: trx }).update({ isActive: false });

			// 2. On active la version cible
			const version = await DashboardVersion.findOrFail(dashboardId);
			version.useTransaction(trx);
			version.isActive = true;
			await version.save();
		});

		await this.pushService.notifyAll({
			title: "Cap'tain Connect",
			body: `Nouvelles consignes du jour publiées`,
			data: { url: "/" },
			icon: "/icons/icon-192.png",
			badge: "/icons/icon-192.png",
		});

		return response.redirect().back();
	}

	async dashboardDelete({ params, response }: HttpContext) {
		const dashboardId = params.dashboardId;

		// On compte pour éviter de supprimer la dernière version existante
		const totalVersions = await DashboardVersion.query().count("* as total");
		if (totalVersions[0].$extras.total <= 1) {
			// Optionnel : envoyer un message d'erreur via session
			return response.redirect().back();
		}

		const versionToDelete = await DashboardVersion.findOrFail(dashboardId);
		const wasActive = versionToDelete.isActive;

		await versionToDelete.delete();

		// SI on a supprimé la version active, on active la toute dernière par date
		if (wasActive) {
			const latest = await DashboardVersion.query()
				.orderBy("created_at", "desc")
				.first();

			if (latest) {
				latest.isActive = true;
				await latest.save();
			}
		}

		return response.redirect().back();
	}

	async interventionOrganisation({ inertia }: HttpContext) {
		const interventions =
			await this.interventionService.getInterventionsForOrder();
		return inertia.render("administration/InterventionsOrganisation", {
			interventions,
		});
	}

	async interventionOrdering({ request, response }: HttpContext) {
		const payload = await request.validateUsing(orderingInterventionValidator);
		await this.interventionService.orderInterventions(payload);
		return response.redirect().toRoute("admin.organise.interventions");
	}

	async showDashboard({ inertia }: HttpContext) {
		const lastVersion = await DashboardVersion.query()
			.where("is_active", true)
			.orderBy("created_at", "desc")
			.first();

		return inertia.render("home", {
			lastVersion,
		});
	}
}
