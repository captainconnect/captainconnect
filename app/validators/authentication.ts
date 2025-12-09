import vine from "@vinejs/vine";

export const authenticationSchema = vine.object({
	username: vine.string().trim(),
	password: vine.string().trim(),
});

export const authenticationValidator = vine.compile(authenticationSchema);
