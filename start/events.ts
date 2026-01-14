import emitter from "@adonisjs/core/services/emitter";
import { DriveService } from "#services/drive_service";

const driveService = new DriveService();

emitter.on("boat:deleted", async (boatSlug) => {
	await driveService.deleteAllByBoatSlug(boatSlug);
});

emitter.on("user:deleted", async (media) => {
	await driveService.deleteFile(media.objectKey);
});
