import vine from "@vinejs/vine";

export const createTaskSchema = vine.object({
	taskGroupId: vine.number().optional().requiredIfMissing("taskGroup"),
	taskGroup: vine.string().optional().requiredIfMissing("taskGroupId"),
	name: vine.string(),
});

export const createTaskValidator = vine.compile(createTaskSchema);

export const taskDetailsSchema = vine.object({
	details: vine.string().minLength(1).trim(),
});

export const taskDetailsValidator = vine.compile(taskDetailsSchema);

export const orderTasksSchema = vine.object({
	groups: vine.array(
		vine.object({
			id: vine.number(),
			order: vine.number(),
			tasks: vine.array(
				vine.object({
					id: vine.number(),
					order: vine.number(),
				}),
			),
		}),
	),
});

export const orderTasksValidator = vine.compile(orderTasksSchema);
