import type { MultipartFile } from "@adonisjs/core/bodyparser";

export type ProjectMediaFormData = {
	file: File | null;
	caption: string;
	boatId: number;
	interventionId?: number;
	taskId?: number;
};
export type MultipleProjectMediaFormData = {
	files: File[] | null;
	boatId: number;
};

export interface CreateProjectMediaPayload {
	file: MultipartFile;
	caption?: string;
	boatId: number;
	interventionId?: number;
	taskId?: number;
}

export interface CreateManyProjectMediaPayload {
	boatId: number;
	files: MultipartFile[];
}

export type Media = {
	projectMediaId: number;
	mediaId: number;
	caption: string;
	extension: string | null;
	width: number | null;
	height: number | null;
	owner: {
		firstName: string;
		lastName: string;
	} | null;
	type: string | null;
	url: string;
};

export type LightboxImage = {
	projectMediaId: number;
	src: string;
	alt?: string;
	width: number;
	height: number;
	downloadUrl?: string;
	title?: string;
	description?: string;
};

export type ProjectMediaFilters = {
	type?: "image" | "video" | "pdf";
	boatId?: number;
	interventionId?: number;
	taskId?: number;
	q?: string;
};

export type MediaType = "image" | "video" | "application";

export type FileMedia = {
	id: number;
	boatName: string;
	interventionTitle?: string;
	taskName?: string;
	owner: string;
	caption: string;
	url: string;
	width?: number;
	height?: number;
	size: number;
	type: MediaType;
	createdAt: string;
};

export type InterventionsFilterData = {
	id: number;
	title: string;
	tasks: { id: number; name: string }[];
};
