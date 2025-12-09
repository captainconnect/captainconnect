import vine from "@vinejs/vine";

export const createUserSchema = vine.object({
	firstname: vine.string(),
	lastname: vine.string(),
	username: vine.string(),
	role_id: vine.number().exists({
		table: "roles",
		column: "id",
	}),
});

export const createUserValidator = vine.compile(createUserSchema);

export const updatePasswordSchema = vine.object({
	password: vine
		.string()
		.trim()
		.minLength(6)
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
		)
		.confirmed(),
});

export const updatePasswordValidator = vine.compile(updatePasswordSchema);

export const updateProfileSchema = vine.object({
	email: vine.string().email().trim().optional().requiredIfMissing("phone"),
	phone: vine
		.string()
		.mobile(() => {
			return {
				locale: ["fr-FR"],
				strictMode: false,
			};
		})
		.optional()
		.requiredIfMissing("email"),
});

export const updateProfileValidator = vine.compile(updateProfileSchema);
