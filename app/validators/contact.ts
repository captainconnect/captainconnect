import vine, { SimpleMessagesProvider } from "@vinejs/vine";

export const contactSchema = vine.object({
	company: vine.string().minLength(1).maxLength(60).trim().optional(),
	fullName: vine.string().minLength(1).maxLength(100).trim(),
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

export const contactValidator = vine.compile(contactSchema);

contactValidator.messagesProvider = new SimpleMessagesProvider({
	required: "Ce champs est requis",
	mobile: "Le numéro de téléphone doit être valide",
	"email.required": "Renseignez au moins un email ou un numéro de téléphone",
	"phone.required": "Renseignez au moins un email ou un numéro de téléphone",
});
