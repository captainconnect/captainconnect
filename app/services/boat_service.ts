import { inject } from "@adonisjs/core";
import emitter from "@adonisjs/core/services/emitter";
import db from "@adonisjs/lucid/services/db";
import Boat from "#models/boat";
import BoatConstructor from "#models/boat_constructor";
import BoatType from "#models/boat_type";
import Media from "#models/media";
import ProjectMedia from "#models/project_media";
import type { BoatPayload, Coordinate } from "#types/boat";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { DriveService } from "./drive_service.js";

@inject()
export class BoatService {
	constructor(protected driveService: DriveService) {}

	async getForMediaList() {
		return await Boat.query()
			.select("id", "name", "slug")
			.whereHas("medias", (query) => {
				query.select("id");
			})
			.withCount("medias")
			.orderBy("name", "asc")
			.pojo();
	}

	async getAll() {
		return await Boat.query()
			.orderBy("name", "asc")
			.preload("boatConstructor")
			.preload("type")
			.preload("contact")
			.preload("interventions", (query) => query.where("status", "IN_PROGRESS"))
			.orderBy("name", "asc");
	}

	async getSlug(id: number) {
		const { slug } = await Boat.findOrFail(id);
		return slug;
	}

	async getBySlug(slug: string) {
		return await Boat.query()
			.where("slug", slug)
			.preload("boatConstructor")
			.preload("type")
			.preload("contact")
			.preload("interventions")
			.firstOrFail();
	}

	async getGallery(slug: string, page: number) {
		return await Boat.query()
			.where("slug", slug)
			.preload("medias", (query) => query.paginate(page, 20))
			.firstOrFail();
	}

	async create(payload: BoatPayload) {
		return await Boat.create({
			...payload,
			...(payload.position
				? {
						place: "Manuelle",
						position: [payload.position[0], payload.position[1]],
					}
				: {}),
		});
	}

	async update(payload: BoatPayload, boat: Boat) {
		const hadPlace =
			!!boat.place && boat.place.trim().length > 0 && boat.place !== "Manuelle";
		const hadPosition = !!boat.position;

		const payloadPlace = payload.place?.trim() ?? "";

		const hasPlace = payloadPlace.length > 0 && payloadPlace !== "Manuelle";

		const hasPosition =
			Array.isArray(payload.position) && payload.position.length === 2;

		if (!hasPlace && !hasPosition) {
			boat.place = null;
			boat.position = null;
		} else if (hadPlace && hasPosition) {
			boat.position = payload.position as Coordinate;
			boat.place = "Manuelle";
		} else if (hadPosition && hasPlace) {
			boat.position = null;
			boat.place = payloadPlace;
		} else if (hasPlace) {
			boat.place = payloadPlace;
			boat.position = null;
		} else if (hasPosition) {
			boat.position = payload.position as Coordinate;
			boat.place = "Manuelle";
		}

		boat.merge({
			...payload,
			position: boat.position,
			place: boat.place,
		});

		const { slug } = await boat.save();
		return slug;
	}

	async delete(slug: string) {
		// On garde la liste des fichiers à delete après commit
		const filesToDelete: { bucket: string; key: string }[] = [];

		await db.transaction(async (trx) => {
			// Lock léger pour éviter des écritures concurrentes pendant la suppression
			const boat = await Boat.query({ client: trx })
				.where("slug", slug)
				.firstOrFail();

			// 1) Récupérer les media_ids liés à CE boat (avant de supprimer les liens)
			const links = await ProjectMedia.query({ client: trx })
				.where("boat_id", boat.id)
				.select("media_id");

			const mediaIds = [...new Set(links.map((l) => l.mediaId))];

			// 2) Supprimer les liens project_medias du boat (avant suppression du boat)
			await ProjectMedia.query({ client: trx })
				.where("boat_id", boat.id)
				.delete();

			// 3) Trouver les medias qui sont devenus orphelins (plus référencés nulle part)
			//    et préparer la suppression des fichiers
			if (mediaIds.length) {
				const orphanMedias = await Media.query({ client: trx })
					.whereIn("id", mediaIds)
					.whereNotExists((qb) => {
						qb.from("project_medias").whereRaw(
							"project_medias.media_id = medias.id",
						);
					})
					.select(["id", "bucket", "object_key"]);

				for (const m of orphanMedias) {
					filesToDelete.push({ bucket: m.bucket, key: m.objectKey });
				}

				// 4) Supprimer les rows medias orphelines
				if (orphanMedias.length) {
					await Media.query({ client: trx })
						.whereIn(
							"id",
							orphanMedias.map((m) => m.id),
						)
						.delete();
				}
			}

			// 5) Supprimer le boat (à la fin)
			await boat.delete();
		});

		// 6) Après commit : supprimer les fichiers (pas dans la transaction DB)
		for (const f of filesToDelete) {
			try {
				await this.driveService.deleteFile(f.key);
			} catch (e) {
				// log + éventuellement retry via job/queue
				console.error("Failed to delete file", f, e);
			}
		}

		// 7) Emit après succès
		await emitter.emit("boat:deleted", slug);
	}

	async getTypes() {
		return await BoatType.query().orderBy("label", "asc");
	}

	async getConstructors() {
		return await BoatConstructor.query().orderBy("name", "asc");
	}
}
