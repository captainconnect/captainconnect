import type { MultipartFile } from "@adonisjs/core/bodyparser";
import type { Role } from "./role.js";

export type User = {
	id: number;
	firstname: string;
	lastname: string;
	username: string;
	phone?: string;
	email?: string;
	role: Role;
	activated: boolean;
	createdAt: Date;
	updatedAt: Date;
	isAdmin: boolean;
	avatar: string | undefined;
	avatarUrl: string | undefined;
};

export interface UserPayload {
	firstname: string;
	lastname: string;
	username: string;
	role_id: number;
}

export interface UpdateProfilePayload {
	email?: string;
	phone?: string;
}

export interface UploadAvatarPayload {
	avatar: MultipartFile;
}
