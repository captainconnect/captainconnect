import vine, { SimpleMessagesProvider } from "@vinejs/vine";

vine.messagesProvider = new SimpleMessagesProvider({
	required: "Ce champs est requis",
	confirmed: "Les mots de passe doivent être identiques",
	email: "L'adresse email est invalide",
	mobile: "Le numéro de téléphone doit être valide",
	regex: "Le format du champs n'est pas valide",
	minLength: "Le champs doit compter au minimum {{ min }} caractères",
	"password.regex":
		"Le mot de passe doit contenir au minimum 6 caractères, un chiffre et un caractère spécial",
	"password.minLength":
		"Le mot de passe doit contenir au minimum {{ min }} caractères",
	date: "Le format de la date n'est pas correct",
	"date.beforeField": "La date de début doit être antérieure à la date de fin",
	"date.afterField": "La date de fin doit être postérieure à la date de début",
});
