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
	isAdmin: () => boolean;
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
