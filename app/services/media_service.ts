import { inject } from "@adonisjs/core";
import db from "@adonisjs/lucid/services/db";
import { E_DUPLICATE_MEDIA } from "#exceptions/duplicate_media_exception";
import Media from "#models/media";
import ProjectMedia from "#models/project_media";
import type {
	CreateManyProjectMediaPayload,
	CreateProjectMediaPayload,
	MediaType,
} from "#types/media";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { DriveService } from "./drive_service.js";

@inject()
export class MediaService {
	constructor(protected driveService: DriveService) {}

	async get(
		boatId: number,
		page: number,
		interventionId?: number,
		taskId?: number,
	) {
		const query = ProjectMedia.query()
			.orderBy("created_at", "desc")
			.preload("boat", (bq) => bq.select(["id", "name"]))
			.preload("intervention", (iq) => iq.select(["id", "title"]))
			.preload("task", (tq) => tq.select(["id", "name"]))
			.preload("media", (mq) => {
				mq.preload("owner", (oq) => oq.select(["id", "firstname", "lastname"]));

				mq.select([
					"id",
					"bucket",
					"object_key",
					"mime_type",
					"extension",
					"width",
					"height",
					"byte_size",
					"owner_id",
					"original_name",
				]);
			})
			.select([
				"id",
				"boat_id",
				"intervention_id",
				"task_id",
				"media_id",
				"caption",
				"created_at",
			])
			.where("boat_id", boatId);

		if (interventionId) {
			query.andWhere("intervention_id", interventionId);
		}

		if (interventionId && taskId) {
			query.andWhere("task_id", taskId);
		}

		const rows = await query.paginate(page, 10);

		const data = await Promise.all(
			rows.all().map(async (pm) => {
				const m = pm.media;

				if (!m) {
					return {
						id: pm.id,
						boatName: pm.boat?.name ?? "",
						interventionName: pm.intervention?.title,
						taskName: pm.task?.name,
						owner: "",
						caption: pm.caption ?? "",
						url: "",
						width: undefined,
						height: undefined,
						size: 0,
						type: "application" as const,
						createdAt: pm.createdAt.toISO() ?? pm.createdAt.toString(),
					};
				}

				const url = this.driveService.getUrl(m.objectKey);

				const mimeRoot = (m.mimeType ?? "application/octet-stream").split(
					"/",
				)[0];
				const mappedType: MediaType =
					mimeRoot === "image" || mimeRoot === "video"
						? mimeRoot
						: "application";

				const ownerStr = m.owner
					? `${m.owner.firstname ?? ""} ${m.owner.lastname ?? ""}`.trim()
					: "";

				return {
					id: pm.id,
					boatName: pm.boat?.name ?? "",
					interventionName: pm.intervention?.title,
					taskName: pm.task?.name,
					owner: ownerStr,
					caption: (pm.caption ?? m.originalName ?? "").trim(),
					url: String(url),
					width: m.width ?? undefined,
					height: m.height ?? undefined,
					size: Number(m.byteSize ?? 0),
					type: mappedType,
					createdAt: pm.createdAt.toISO() ?? pm.createdAt.toString(),
				};
			}),
		);

		return {
			data,
			meta: rows.getMeta(),
		};
	}

	async create(
		payload: CreateProjectMediaPayload,
		userId: number,
		boatSlug: string,
		multiple: boolean = false,
	) {
		const media = await this.driveService.storeFile(payload.file, boatSlug);
		try {
			const { id } = await Media.create({
				bucket: media.bucket,
				objectKey: media.objectKey,
				mimeType: media.mimeType,
				extension: media.extension,
				byteSize: media.byteSize,
				width: media.width,
				height: media.height,
				checksumSha256: media.checksumSha256,
				originalName: media.originalName,
				ownerId: userId,
			});

			await ProjectMedia.create({
				boatId: payload.boatId,
				interventionId: payload.interventionId,
				taskId: payload.taskId,
				caption: payload.caption,
				mediaId: id,
			});
		} catch (_) {
			await this.driveService.deleteFile(media.objectKey);
			if (!multiple) {
				throw new E_DUPLICATE_MEDIA("Ce media a déjà été ajouté (Duplication)");
			} else {
				return false;
			}
		}
	}

	async createMany(
		payload: CreateManyProjectMediaPayload,
		userId: number,
		boatSlug: string,
	) {
		for (const file of payload.files) {
			await this.create(
				{
					boatId: payload.boatId,
					file: file,
				},
				userId,
				boatSlug,
				true,
			);
		}
	}

	async delete(projectMediaId: number) {
		const projectMedia = await ProjectMedia.query()
			.where("id", projectMediaId)
			.preload("media")
			.firstOrFail();
		const media = projectMedia.media;
		const bucket = media?.bucket;
		const objectKey = media?.objectKey;

		await db.transaction(async (trx) => {
			projectMedia.useTransaction(trx);
			if (media) {
				media.useTransaction(trx);
				await media.delete();
			}
			await projectMedia.delete();
		});

		if (bucket && objectKey) {
			try {
				await this.driveService.deleteFile(objectKey);
			} catch (error) {
				console.error("File delete failed", { bucket, objectKey, error });
			}
		}
	}

	async deleteMany(projectMediaIds: number[]) {
		projectMediaIds.forEach(async (id) => {
			await this.delete(id);
		});
	}
}
