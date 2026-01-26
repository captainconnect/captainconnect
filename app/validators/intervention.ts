import vine from "@vinejs/vine";

const taskSchema = vine.object({
	name: vine.string(),
	status: vine.enum(["IN_PROGRESS", "DONE"]).optional(),
});

const taskGroupSchema = vine.object({
	name: vine.string(),
	tasks: vine.array(taskSchema).minLength(1),
});

export const createInterventionSchema = vine.object({
	title: vine.string(),
	description: vine.string().nullable(),
	startAt: vine.date().beforeField("endAt").nullable(),
	endAt: vine.date().afterField("startAt").nullable(),
	taskGroups: vine.array(taskGroupSchema),
	priority: vine.enum(["LOW", "NORMAL", "HIGH", "EXTREME"]),
});

export const createInterventionValidator = vine.compile(
	createInterventionSchema,
);

export const updateInterventionSchema = vine.object({
	title: vine.string(),
	description: vine.string().nullable(),
	startAt: vine.date().beforeField("endAt").nullable(),
	endAt: vine.date().afterField("startAt").nullable(),
	priority: vine.enum(["LOW", "NORMAL", "HIGH", "EXTREME"]),
});

export const updateInterventionValidator = vine.compile(
	updateInterventionSchema,
);

export const suspendInterventionSchema = vine.object({
	reason: vine.string(),
});

export const suspendInterventionValidator = vine.compile(
	suspendInterventionSchema,
);

export const orderingInterventionSchema = vine.object({
	interventions: vine.array(
		vine.object({
			id: vine.number(),
			index: vine.number(),
		}),
	),
});

export const orderingInterventionValidator = vine.compile(
	orderingInterventionSchema,
);
