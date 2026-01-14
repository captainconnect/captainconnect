import React from "react";
import type { FileMedia } from "#types/media";

type UseMediaProps = {
	medias: FileMedia[];
};

export default function useMedia({ medias }: UseMediaProps) {
	const computeDocuments = React.useCallback(() => {
		const dcmts = medias.filter((m) => m.type === "application");
		return dcmts;
	}, [medias]);

	const computeImages = React.useCallback(() => {
		const imgs = medias.filter((m) => m.type !== "application");
		return imgs;
	}, [medias]);

	const [images, setImages] = React.useState<FileMedia[]>(() =>
		computeImages(),
	);
	const [documents, setDocuments] = React.useState<FileMedia[]>(() =>
		computeDocuments(),
	);

	React.useEffect(() => {
		setImages(computeImages());
		setDocuments(computeDocuments());
	}, [computeImages, computeDocuments]);

	return {
		images,
		setImages,
		documents,
		setDocuments,
	};
}
