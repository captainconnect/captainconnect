import vine, { SimpleMessagesProvider } from "@vinejs/vine";

export const projectMediaSchema = vine.object({
	file: vine.file({
		size: "20mb",
		extnames: ["jpg", "jpeg", "png", "webp", "pdf"],
	}),
	caption: vine.string().optional(),
	boatId: vine.number().exists({ table: "boats", column: "id" }).min(0),
	interventionId: vine
		.number()
		.exists({ table: "interventions", column: "id" })
		.optional(),
	taskId: vine.number().exists({ table: "tasks", column: "id" }).optional(),
});

export const projectMediaValidator = vine.compile(projectMediaSchema);

export const massProjectMediaSchema = vine.object({
	files: vine
		.array(
			vine.file({
				size: "20mb",
				extnames: ["jpg", "jpeg", "png", "webp", "pdf"],
			}),
		)
		.minLength(1)
		.maxLength(20),
	boatId: vine.number().exists({ table: "boats", column: "id" }).min(0),
});

export const massProjectMediaValidator = vine.compile(massProjectMediaSchema);

massProjectMediaValidator.messagesProvider = new SimpleMessagesProvider({
	"array.minLength": "Au moins un fichier est requis.",
	"array.maxLength":
		"Limité à 20 fichiers maximum à la fois. Ou 300mb au total lors de la requête.",
});

export const massProjectMediaDeleteSchema = vine.object({
	projectMediaIds: vine
		.array(vine.number().exists({ table: "project_medias", column: "id" }))
		.minLength(1)
		.maxLength(50),
});

export const massProjectMediaDeleteValidator = vine.compile(
	massProjectMediaDeleteSchema,
);
