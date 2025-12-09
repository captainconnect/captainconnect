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
