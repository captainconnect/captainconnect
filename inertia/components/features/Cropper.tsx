import { centerCrop, makeAspectCrop, type PixelCrop } from "react-image-crop";

export function getCenteredAspectCrop(
	mediaWidth: number,
	mediaHeight: number,
	aspect: number,
) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: "%",
				width: 80,
			},
			aspect,
			mediaWidth,
			mediaHeight,
		),
		mediaWidth,
		mediaHeight,
	);
}

export async function pixelCropToFile(
	image: HTMLImageElement,
	crop: PixelCrop,
	originalName: string,
): Promise<File> {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Impossible d'obtenir le contexte canvas");

	// react-image-crop donne le crop en pixels "affichés"
	// Il faut re-mapper vers les pixels naturels de l'image
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	const pixelRatio = window.devicePixelRatio ?? 1;

	canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
	canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	ctx.imageSmoothingQuality = "high";

	const sx = crop.x * scaleX;
	const sy = crop.y * scaleY;
	const sw = crop.width * scaleX;
	const sh = crop.height * scaleY;

	ctx.drawImage(
		image,
		sx,
		sy,
		sw,
		sh,
		0,
		0,
		crop.width * scaleX,
		crop.height * scaleY,
	);

	const blob: Blob = await new Promise((resolve, reject) => {
		canvas.toBlob(
			(b) => (b ? resolve(b) : reject(new Error("toBlob() a échoué"))),
			"image/jpeg",
			0.92,
		);
	});

	const safeBase =
		originalName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "_") ||
		"avatar";

	return new File([blob], `${safeBase}_cropped.jpg`, { type: "image/jpeg" });
}
