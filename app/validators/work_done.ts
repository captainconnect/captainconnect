import vine from "@vinejs/vine";

export const addWorkDoneSchema = vine.object({
	date: vine.date(),
	hour_count: vine.number().min(0.25),
	work_done: vine.string(),
	used_materials: vine.string().nullable(),
	technician_ids: vine
		.array(vine.number().positive().exists({ table: "users", column: "id" }))
		.minLength(1),
});

export const addWorkDoneValidator = vine.compile(addWorkDoneSchema);
