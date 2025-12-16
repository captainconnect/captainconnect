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
	};
}
