import type { MultipartFile } from "@adonisjs/core/bodyparser";
import { cuid } from "@adonisjs/core/helpers";
import type { DriveDirectory, DriveFile } from "@adonisjs/drive";
import drive from "@adonisjs/drive/services/main";
import env from "#start/env";
import { extractMetaData } from "../helpers/drive.js";

export class DriveService {
	getUrl(objectKey: string): string {
		return `${env.get("MINIO_CDN_URL")}/${env.get("S3_BUCKET")}/${objectKey}`;
	}

	createObjectKey(folder: string, extname: string) {
		return `bateaux/${folder}/${cuid()}.${extname}`;
	}

	createAvatarObjectKey(userId: number, extname: string) {
		return `avatars/user_${userId}-${cuid()}.${extname}`;
	}

	createBoatThumbnailObjectKey(boatId: number, extname: string) {
		return `thumbnails/boat_${boatId}-${cuid()}.${extname}`;
	}

	async storeFile(file: MultipartFile, boatSlug: string) {
		const fileData = await extractMetaData(file);
		const extName = fileData.extension;
		const objectKey = this.createObjectKey(boatSlug, extName);
		await file.moveToDisk(objectKey);
		return {
			...fileData,
			objectKey,
		};
	}

	async storeAvatar(file: MultipartFile, userId: number) {
		const fileData = await extractMetaData(file);
		const extName = fileData.extension;
		const objectKey = this.createAvatarObjectKey(userId, extName);
		await file.moveToDisk(objectKey);
		return {
			...fileData,
			objectKey,
		};
	}

	async storeThumbnail(file: MultipartFile, boatId: number) {
		const fileData = await extractMetaData(file);
		const extName = fileData.extension;
		const objectKey = this.createBoatThumbnailObjectKey(boatId, extName);
		await file.moveToDisk(objectKey);
		return {
			...fileData,
			objectKey,
		};
	}

	async deleteFile(objectKey: string) {
		const disk = drive.use();
		await disk.delete(objectKey);
	}

	async deleteAllByBoatSlug(boatSlug: string) {
		const disk = drive.use();
		const prefix = `bateaux/${boatSlug}`;

		const result = await disk.listAll(prefix);

		for await (const f of result.objects as Iterable<
			DriveFile | DriveDirectory
		>) {
			const key = typeof f === "string" ? f : f.name;
			await disk.delete(`bateaux/${boatSlug}/${key}`);
		}
	}
}
