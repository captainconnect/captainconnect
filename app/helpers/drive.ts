import crypto from "node:crypto";
import fs from "node:fs";
import type { MultipartFile } from "@adonisjs/core/bodyparser";
import sharp from "sharp";
import env from "#start/env";

const generateCheckSum256 = async (path: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash("sha256");
		const stream = fs.createReadStream(path);

		stream.on("error", reject);
		stream.on("data", (chunk) => hash.update(chunk));
		stream.on("end", () => resolve(hash.digest("hex")));
	});
};

export const extractMetaData = async (file: MultipartFile) => {
	if (!file.tmpPath) {
		throw new Error("Missing tmpPath on uploaded file");
	}

	let width: number | null = null;
	let height: number | null = null;

	// Dimensions uniquement si image réelle
	if (file.type === "image") {
		const meta = await sharp(file.tmpPath).metadata();
		width = meta.width ?? null;
		height = meta.height ?? null;
	}

	const checksumSha256 = await generateCheckSum256(file.tmpPath);

	const extName = (file.extname ?? "bin").replace(/^\./, "").toLowerCase();

	return {
		bucket: env.get("S3_BUCKET"),

		mimeType: `${file.type}/${file.subtype}`,
		extension: extName,
		byteSize: file.size,

		width,
		height,

		originalName: file.clientName,
		checksumSha256,
	};
};
