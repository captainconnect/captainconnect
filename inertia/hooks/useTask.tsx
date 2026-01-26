import { router } from "@inertiajs/react";
import { CircleCheck, Clock, Edit, FileUp, Pause, Trash } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Task } from "#types/intervention";
import type { ActionButton } from "#types/ui/section";

enum Modals {
	None,
	ConfirmDeletion,
	UpdateModal,
	AddMediaModal,
	SuspendModal,
	UpdateWorkdone,
}
type Tag = {
	label: string;
	icon: ReactNode;
	className: string;
};

type UseTaskProps = {
	task: Task;
	interventionSlug: string;
};

export default function useTask({ task, interventionSlug }: UseTaskProps) {
	const [currentModal, setCurrentModal] = useState<Modals>(Modals.None);

	const getWorkDones = () => {
		if (!task.workDones) return [];

		return task.workDones.map((wd) => {
			const hourCount = wd.hours?.[0]?.count ?? 0;

			const technicians =
				wd.hours
					?.map((h) => h.user)
					.filter(Boolean)
					.map((t) => ({
						id: t.id,
						label: `${t.firstname} ${t.lastname}`,
						avatar: t.avatarUrl,
						initials: `${t.firstname[0]}${t.lastname[0]}`,
					})) ?? [];

			// ✅ ids de tous les techniciens sélectionnés (uniques)
			const technician_ids = Array.from(
				new Set(
					wd.hours
						?.map((h) => h.user?.id)
						.filter((id): id is number => typeof id === "number"),
				),
			);

			return {
				id: wd.id,
				taskId: wd.taskId,
				interventionId: wd.interventionId,
				workDone: wd.workDone,
				usedMaterials: wd.usedMaterials,
				date: new Date(wd.date).toLocaleDateString("fr-FR"),
				createdAt: wd.createdAt,
				updatedAt: wd.updatedAt,

				hour_count: hourCount,
				technicians,

				technician_ids,
			};
		});
	};

	const actionButtons: ActionButton[] = [
		{
			icon: <FileUp size="18" />,
			text: "Ajouter un fichier",
			onClick: () => setCurrentModal(Modals.AddMediaModal),
			variant: "accent",
		},
		{
			icon: <Edit size="18" />,
			text: "Modifier la tâche",
			onClick: () => setCurrentModal(Modals.UpdateModal),
			mustBeAdmin: true,
		},
		...(task.suspensionReason === null
			? [
					{
						icon: <Pause size="18" />,
						text: "Suspendre la tâche",
						onClick: () => setCurrentModal(Modals.SuspendModal),
						mustBeAdmin: true,
					},
				]
			: []),
		{
			icon: <Trash size="18" />,
			variant: "danger",
			text: "Supprimer la tâche",
			onClick: () => setCurrentModal(Modals.ConfirmDeletion),
			mustBeAdmin: true,
		},
	];

	const tag: Tag =
		task.status === "IN_PROGRESS"
			? {
					label: "En cours",
					icon: <Clock size="18" />,
					className: "bg-primary hidden md:flex",
				}
			: {
					label: "Terminée",
					icon: <CircleCheck size="18" />,
					className: "bg-primary hidden md:flex",
				};

	const handleDelete = () => {
		router.delete(`/tasks/${interventionSlug}/${task.id}`);
	};

	const closeModal = () => {
		setCurrentModal(Modals.None);
	};

	return {
		currentModal,
		setCurrentModal,
		actionButtons,
		tag,
		closeModal,
		Modals,
		handleDelete,
		getWorkDones,
	};
}
