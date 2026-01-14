import type { Boat } from "./boat.js";
import type { Media } from "./media.js";
import type { User } from "./user.js";
import type { WorkDone } from "./workdone.js";

export type Intervention = {
	id: number;
	title: string;
	slug: string;
	description?: string;
	status: InterventionStatus;
	startAt?: Date;
	endAt?: Date;
	priority: InterventionPriority;
	boat: Boat;
	taskGroups: TaskGroup[];
	totalHours?: number;
	createdAt: Date;
	updatedAt: Date;
};

export type Task = {
	id: number;
	taskGroup: TaskGroup;
	name: string;
	status: TaskStatus;
	details?: string;
	sort: number;
	createdAt: Date;
	updatedAt: Date;
	workDones?: WorkDone[];
	medias?: Media[];
};

export type TaskGroup = {
	id: number;
	name: string;
	sort: number;
	intervention: Intervention;
	tasks: Task[];
};

export type InterventionStatus = "SUSPENDED" | "IN_PROGRESS" | "DONE";

export type InterventionPriority = "LOW" | "NORMAL" | "HIGH" | "EXTREME";

export type TaskStatus = "IN_PROGRESS" | "DONE";

export interface CreateInterventionPayload {
	title: string;
	description: string | null;
	startAt: Date | null;
	endAt: Date | null;
	taskGroups: {
		id?: number;
		name: string;
		tasks: {
			id?: number;
			name: string;
			status?: TaskStatus;
		}[];
	}[];
}

export interface UpdateInterventionPayload {
	title: string;
	description: string | null;
	startAt: Date | null;
	endAt: Date | null;
}

export interface AddHourPayload {
	userId: number;
	date: Date;
	count: number;
}

export type Hour = {
	id: number;
	user: User;
	taskId: number;
	date: Date;
	count: number;
};

export interface TaskDetailsPayload {
	details: string;
}

export interface CreateTaskPayload {
	taskGroupId?: number;
	taskGroup?: string;
	name: string;
}

export interface OrderTaskPayload {
	groups: {
		id: number;
		order: number;
		tasks: {
			id: number;
			order: number;
		}[];
	}[];
}

export interface UpdateTaskPayload {
	name: string;
	taskGroupId: number;
}
