import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import db from "@adonisjs/lucid/services/db";
import DashboardVersion from "#models/dashboard_version";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { InterventionService } from "#services/intervention_service";
import { orderingInterventionValidator } from "#validators/intervention";

@inject()
export default class AdministrationController {
	constructor(protected interventionService: InterventionService) {}

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

	async dashboardStore({ request, response }: HttpContext) {
		const data = request.only(["name", "content"]);

		// On crée la version (par défaut isActive est false via la migration)
		await DashboardVersion.create(data);

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
			const version = await DashboardVersion.findOrFail(dashboardId, {
				client: trx,
			});
			version.isActive = true;
			await version.save();
		});

		return response.redirect().back();
	}

	/**
	 * Supprimer une version avec sécurité
	 */
	async dashboardDelete({ params, response }: HttpContext) {
		const dashboardId = params.dashboardId;

		const versionToDelete = await DashboardVersion.findOrFail(dashboardId);
		const wasActive = versionToDelete.isActive;

		await versionToDelete.delete();

		// SI on a supprimé la version active, on active la toute dernière existante
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
