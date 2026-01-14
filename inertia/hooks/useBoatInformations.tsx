import {
	Building2,
	Files,
	FileUp,
	Hash,
	Mail,
	Phone,
	Radio,
	Ruler,
	Trash,
	Wrench,
} from "lucide-react";
import { useState } from "react";
import type { Boat } from "#types/boat";
import type { ActionButton } from "#types/ui/section";
import type { InformationBlockItemProps } from "~/components/ui/InformationBlockItem";

export default function useBoatInformations(
	boat: Boat,
	openModal: (open: true) => void,
) {
	const [addProjectMediaModalOpen, setAddProjectMediaModalOpen] =
		useState(false);

	const boatData: InformationBlockItemProps[] = [
		{
			label: "Type",
			value: boat.type?.label,
		},
		{
			label: "Place/Panne",
			value: boat.place,
		},
		{
			label: "Constructeur",
			value: boat.boatConstructor?.name,
		},
		{
			label: "Modèle",
			value: boat.model,
		},
		{
			icon: <Hash size="14" />,
			label: "MMSI",
			value: boat.mmsi,
		},
		{
			icon: <Radio size="14" />,
			label: "Indicatif radio",
			value: boat.callSign,
		},
		{
			icon: <Ruler size="14" />,
			label: "Longueur",
			value: boat.length ? `${boat.length} pieds` : null,
		},
		{
			icon: <Ruler size="14" />,
			label: "Largeur",
			value: boat.beam ? `${boat.beam} pieds` : null,
		},
	];

	const contactData: InformationBlockItemProps[] = [
		{
			icon: <Building2 size="18" />,
			label: "Entreprise",
			value: boat.contact?.company,
		},
		{
			label: "Nom",
			value: boat.contact?.fullName,
		},
		{
			icon: <Phone size="18" />,
			label: "Téléphone",
			value: boat.contact?.phone,
		},
		{
			icon: <Mail size="18" />,
			label: "Email",
			value: boat.contact?.email,
		},
	];

	const actionButtons: ActionButton[] = [
		{
			icon: <FileUp size="18" />,
			text: "Ajouter un fichier",
			variant: "accent",
			onClick: () => setAddProjectMediaModalOpen(true),
		},
		{
			icon: <Files size="18" />,
			text: "Accéder aux fichiers",
			link: {
				type: "NAVIGATE" as const,
				href: `/fichiers/${boat.slug}`,
			},
		},
		{
			icon: <Wrench size="18" />,
			text: "Nouvelle intervention",
			link: {
				type: "NAVIGATE" as const,
				href: `/interventions/nouvelle/${boat.slug}`,
			},
			mustBeAdmin: true,
		},
		...(boat.contact?.phone
			? [
					{
						icon: <Phone size="18" />,
						text: "Appeler le contact",
						link: {
							type: "ACTION" as const,
							href: `tel:${boat.contact.phone}`,
						},
					},
				]
			: []),
		...(boat.contact?.email
			? [
					{
						icon: <Mail size="18" />,
						text: "Envoyer un mail au contact",
						link: {
							type: "ACTION" as const,
							href: `mailto:${boat.contact.email}`,
						},
					},
				]
			: []),
	];

	const dangerActionsButtons: ActionButton[] = [
		{
			icon: <Trash size="18" />,
			text: "Supprimer le bateau",
			onClick: () => openModal(true),
			variant: "danger",
		},
	];

	return {
		boatData,
		contactData,
		actionButtons,
		dangerActionsButtons,
		addProjectMediaModalOpen,
		setAddProjectMediaModalOpen,
	};
}
