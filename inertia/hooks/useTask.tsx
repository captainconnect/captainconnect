import { router } from "@inertiajs/react";
import { CircleCheck, Clock, Edit, Trash } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Task } from "#types/intervention";
import type { ActionButton } from "#types/ui/section";

enum Modals {
	None,
	ConfirmDeletion,
	UpdateModal,
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

	const formatTechnicians = (names: string[]) => {
		if (names.length === 0) return "";
		if (names.length === 1) return names[0];
		if (names.length === 2) return `${names[0]} et ${names[1]}`;
		return `${names.slice(0, -1).join(", ")} et ${names.at(-1)}`;
	};

	const getWorkDones = () => {
		if (!task.workDones) return [];

		return task.workDones.map((wd) => {
			const hourCount = wd.hours?.[0]?.count ?? 0;

			const technicians =
				wd.hours
					?.map((h) => h.user)
					.filter(Boolean)
					.map((t) => `${t.firstname} ${t.lastname}`) ?? [];

			const technicianLabel = formatTechnicians(technicians);

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
				technicians: technicianLabel,
			};
		});
	};

	const actionButtons: ActionButton[] = [
		{
			icon: <Edit size="18" />,
			text: "Modifier la tâche",
			onClick: () => setCurrentModal(Modals.UpdateModal),
		},
		{
			icon: <Trash size="18" />,
			variant: "danger",
			text: "Supprimer la tâche",
			onClick: () => setCurrentModal(Modals.ConfirmDeletion),
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
