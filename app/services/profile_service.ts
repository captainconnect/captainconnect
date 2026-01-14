import { inject } from "@adonisjs/core";
import { E_DUPLICATE_MEDIA } from "#exceptions/duplicate_media_exception";
import Media from "#models/media";
import User from "#models/user";
import type { UpdateProfilePayload, UploadAvatarPayload } from "#types/user";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { DriveService } from "./drive_service.js";

@inject()
export class ProfileService {
	constructor(protected driveService: DriveService) {}

	async update(id: number, payload: UpdateProfilePayload) {
		const user = await User.findOrFail(id);
		user.merge(payload);
		await user.save();
	}

	async uploadAvatar(payload: UploadAvatarPayload, userId: number) {
		const user = await User.findOrFail(userId);

		if (user.avatarId) {
			const oldAvatar = await Media.find(user.avatarId);
			if (oldAvatar) {
				await this.driveService.deleteFile(oldAvatar.objectKey);
				await oldAvatar.delete();
			}
		}
		const media = await this.driveService.storeAvatar(payload.avatar, userId);
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
			user.avatarId = id;
			await user.save();
		} catch (_) {
			await this.driveService.deleteFile(media.objectKey);

			throw new E_DUPLICATE_MEDIA(
				"Cette photo a déjà été ajouté (Duplication)",
			);
		}
	}

	async deleteAvatar(userId: number) {
		const user = await User.findOrFail(userId);

		if (user.avatarId) {
			const avatar = await Media.find(user.avatarId);
			if (avatar) {
				await avatar?.delete();
				await this.driveService.deleteFile(avatar.objectKey);
			}
			user.avatarId = null;
			await user.save();
		}
	}
}
