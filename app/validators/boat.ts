import vine, { SimpleMessagesProvider } from "@vinejs/vine";
import type { Coordinate } from "#types/boat";

export const boatSchema = vine.object({
	name: vine.string().minLength(1).maxLength(100),
	contact_id: vine
		.number()
		.exists({ table: "contacts", column: "id" })
		.nullable(),
	boat_type_id: vine
		.number()
		.exists({ table: "boat_types", column: "id" })
		.nullable()
		.optional(),
	boat_constructor_id: vine
		.number()
		.exists({ table: "boat_constructors", column: "id" })
		.nullable()
		.optional(),
	model: vine.string().nullable(),
	place: vine.string().nullable().optional(),
	position: vine
		.array(vine.number())
		.parse((arr) => arr as Coordinate)
		.nullable()
		.optional(),
	mmsi: vine
		.string()
		.regex(/^\d{9}$/)
		.unique({ table: "boats", column: "id" })
		.nullable(),
	call_sign: vine
		.string()
		.regex(/^[A-Z0-9]{3,7}$/i)
		.unique({ table: "boats", column: "id" })
		.nullable(),
	length: vine.number().min(0).nullable(),
	beam: vine.number().min(0).nullable(),
	note: vine.string().nullable().optional(),
});

export const boatValidator = vine.compile(boatSchema);

boatValidator.messagesProvider = new SimpleMessagesProvider({
	// --- name ---
	"name.required": "Le nom du bateau est obligatoire.",
	"name.minLength": "Le nom du bateau doit contenir au moins 1 caractère.",
	"name.maxLength": "Le nom du bateau ne peut pas dépasser 254 caractères.",
	"name.regex":
		"Le nom du bateau contient des caractères non autorisés (lettres, chiffres, espaces, points, tirets et @ uniquement).",

	// --- boat_brand_id ---
	"constructor_id.number": "Le constructeur doit être un identifiant valide.",
	"constructor_id.exists": "Le constructeur sélectionné n’existe pas.",
	"constructor_id.nullable": "Le constructeur peut être laissé vide.",

	// --- model ---
	"model.string": "Le modèle doit être une chaîne de caractères.",
	"model.nullable": "Le modèle peut être laissé vide.",

	// --- boat_type_id ---
	"type_id.number": "Le type de bateau doit être un identifiant valide.",
	"type_id.exists": "Le type de bateau sélectionné n’existe pas.",
	"type_id.nullable": "Le type de bateau peut être laissé vide.",

	// --- contact_id ---
	"contact_id.number": "Le contact doit être un identifiant valide.",
	"contact_id.exists": "Le contact sélectionné n’existe pas.",
	"contact_id.nullable": "Le contact peut être laissé vide.",

	// --- mmsi ---
	"mmsi.string": "Le numéro MMSI doit être une chaîne de chiffres.",
	"mmsi.regex": "Le numéro MMSI doit comporter exactement 9 chiffres.",
	"mmsi.unique": "Ce numéro MMSI est déjà utilisé par un autre bateau.",

	// --- call_sign ---
	"call_sign.string": "L’indicatif radio doit être une chaîne de caractères.",
	"call_sign.regex":
		"L’indicatif radio doit contenir entre 3 et 7 caractères alphanumériques.",
	"call_sign.unique":
		"Cet indicatif radio est déjà utilisé par un autre bateau.",

	// --- length ---
	"length.number": "La longueur doit être un nombre.",
	"length.min": "La longueur ne peut pas être négative.",

	// --- beam ---
	"beam.number": "La largeur doit être un nombre.",
	"beam.min": "La largeur ne peut pas être négative.",
});

export const uploadThumbnailSchema = vine.object({
	thumbnail: vine.file({
		extnames: ["jpg", "jpeg", "png", "webp"],
		size: "30mb",
	}),
});

export const uploadThumbnailValidator = vine.compile(uploadThumbnailSchema);
