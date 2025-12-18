import type { Hour } from "./intervention.js";
import type { User } from "./user.js";

export interface CreateWorkDonePayload {
	date: Date;
	hour_count: number;
	work_done: string;
	used_materials: string | null;
	technician_ids: number[];
}

export type WorkDone = {
	id: number;
	date: Date;
	interventionId: number;
	taskId: number;
	workDone: string;
	usedMaterials?: string | null;
	technicians: User[];
	hours: Hour[];
	createdAt: Date;
	updatedAt: Date;
};

export type FormattedWorkDone = {
	id: number;
	taskId: number;
	interventionId: number;
	workDone: string;
	usedMaterials?: string | null;
	date: string;
	createdAt: Date;
	updatedAt: Date;
	hour_count: number;
	technicians: string;
};
