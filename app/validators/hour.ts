import vine from "@vinejs/vine";

export const hourSchema = vine.object({
	userId: vine.number().exists({ table: "users", column: "id" }),
	date: vine.date(),
	count: vine.number().min(0.25),
});

export const hourValidator = vine.compile(hourSchema);
