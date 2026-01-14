import { router } from "@inertiajs/react";
import {
	Building2,
	Calendar,
	Check,
	Clock,
	Files,
	FileUp,
	LoaderCircle,
	Mail,
	MapPin,
	Pause,
	Phone,
	Play,
	Sailboat,
	Ship,
	Stamp,
	Trash,
} from "lucide-react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import type { ActionButton } from "#types/ui/section";
import type { InformationCardProps } from "~/components/layout/intervention/InformationCard";
import type { InformationBlockItemProps } from "~/components/ui/InformationBlockItem";

export default function useIntervention(
	intervention: Intervention,
	openModal?: (open: boolean) => void,
	mediasCount?: number,
) {
	const [addProjectMediaModalOpen, setAddProjectMediaModalOpen] =
		useState(false);
	const { boat } = intervention;

	const now = new Date();
	const createdAt = new Date(intervention.createdAt);
	const startAt = intervention.startAt ? new Date(intervention.startAt) : null;
	const endAt = intervention.endAt ? new Date(intervention.endAt) : null;

	const allTasks =
		intervention.taskGroups.flatMap((group) => group.tasks) ?? [];

	const totalTasks = allTasks.length;

	const doneTasks = allTasks.filter((t) => t.status === "DONE").length;
	const inProgressTasks = allTasks.filter(
		(t) => t.status === "IN_PROGRESS",
	).length;

	const progress =
		totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

	const status: {
		label: string;
		color: string;
	} = {
		label: "En cours",
		color: "bg-gray-500",
	};

	if (startAt && startAt > now) {
		status.label = "Prévu";
		status.color = "bg-indigo-600";
	} else if (endAt && endAt < now) {
		status.label = "En retard";
		status.color = "bg-red-600";
	}

	if (intervention.status === "SUSPENDED") {
		status.label = "Suspendue";
		status.color = "bg-yellow-600";
	} else if (intervention.status === "IN_PROGRESS") {
		status.label = "En\u00A0cours";
		status.color = "bg-blue-950";
	} else if (intervention.status === "DONE") {
		status.label = "Facturée";
		status.color = "bg-green-500";
	}

	const cards: InformationCardProps[] = [
		{
			title: "Tâches",
			icon: <Check color="gray" />,
			data: totalTasks,
			link: `/interventions/${intervention.slug}/taches`,
		},
		{
			title: "Progression",
			icon: <LoaderCircle color="gray" />,
			data: `${progress}%`,
		},
		{
			title: "Heures",
			icon: <Clock color="gray" />,
			data: `${intervention.totalHours}h`,
		},
		...(boat.place
			? [
					{
						title: "Place",
						icon: <MapPin color="gray" />,
						data: boat.place,
					},
				]
			: []),
		...(startAt
			? [
					{
						title: "Début",
						icon: <Calendar color="gray" />,
						data: startAt.toLocaleDateString("fr-FR"),
					},
				]
			: []),
		...(endAt
			? [
					{
						title: "Échéance",
						icon: <Calendar color="gray" />,
						data: endAt.toLocaleDateString("fr-FR"),
					},
				]
			: []),
		{
			title: "Status",
			icon: <Stamp color="gray" />,
			data: status.label,
			alert: status.label === "En\u00A0retard",
		},
	];

	const actionsButtons: ActionButton[] = [
		{
			icon: <FileUp size="18" />,
			text: "Ajouter un fichier",
			variant: "accent",
			onClick: () => setAddProjectMediaModalOpen(true),
		},
		{
			icon: <Files size="18" />,
			text: `Accéder aux fichiers (${mediasCount})`,
			link: {
				type: "NAVIGATE",
				href: `/fichiers/${boat.slug}?intervention_id=${intervention.id}`,
			},
		},
		{
			icon:
				boat.type?.label === "Voilier" || boat.type?.label === "Catamaran" ? (
					<Sailboat size="18" />
				) : (
					<Ship size="18" />
				),
			text: "Accéder à la page du bateau",
			link: {
				type: "NAVIGATE",
				href: `/bateaux/${boat.slug}`,
			},
		},
		...(intervention.status === "DONE"
			? [
					{
						icon: <Check size="18" />,
						text: "Ouvrir l'intervention",
						onClick: () =>
							router.patch(`/interventions/${intervention.slug}/resume`),
						variant: "accent" as const,
						mustBeAdmin: true,
					},
				]
			: [
					{
						icon: <Check size="18" />,
						text: "Marquer comme facturée",
						onClick: () =>
							router.patch(`/interventions/${intervention.slug}/close`),
						variant: "accent" as const,
						mustBeAdmin: true,
					},
				]),
		...(intervention.status === "SUSPENDED"
			? [
					{
						icon: <Play size="18" />,
						text: "Reprendre l'intervention",
						mustBeAdmin: true,
						onClick: () =>
							router.patch(`/interventions/${intervention.slug}/resume`),
					},
				]
			: [
					{
						icon: <Pause size="18" />,
						text: "Suspendre l'intervention",
						mustBeAdmin: true,
						onClick: () =>
							router.patch(`/interventions/${intervention.slug}/suspend`),
					},
				]),
		{
			icon: <Trash size="18" />,
			text: "Supprimer l'intervention",
			mustBeAdmin: true,
			onClick: openModal ? () => openModal(true) : () => {},
			variant: "danger",
		},
	];

	const boatData: InformationBlockItemProps[] = [
		{
			label: "Nom",
			value: intervention.boat.name,
		},
		{
			label: "Constructeur",
			value: intervention.boat.boatConstructor?.name,
		},
		{
			label: "Modèle",
			value: intervention.boat.model,
		},
		{
			label: "Type",
			value: intervention.boat.type?.label,
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

	const interventionData: InformationBlockItemProps[] = [
		{
			label: "Description",
			value: intervention.description,
		},
		{
			label: "Priorité",
			value: intervention.priority,
		},
		{
			icon: <Calendar size="18" />,
			label: "Date de création",
			value: createdAt.toLocaleDateString("fr-FR"),
		},
	];

	return {
		createdAt,
		startAt,
		endAt,
		allTasks,
		totalTasks,
		inProgressTasks,
		doneTasks,
		progress,
		cards,
		status,
		actionsButtons,
		boatData,
		contactData,
		interventionData,
		setAddProjectMediaModalOpen,
		addProjectMediaModalOpen,
	};
}
