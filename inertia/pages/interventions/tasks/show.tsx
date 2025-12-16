import { Head, router } from "@inertiajs/react";
import {
	CalendarClock,
	CircleCheck,
	Clock,
	ClockPlus,
	File,
	Save,
	Trash,
} from "lucide-react";
import { useState } from "react";
import type { Hour, Task } from "#types/intervention";
import AddHourForm from "~/components/features/intervention/task/AddHourForm";
import HourList from "~/components/features/intervention/task/HourList";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import Button from "~/components/ui/buttons/Button";
import Textarea from "~/components/ui/inputs/TextArea";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Section from "~/components/ui/Section";

type TaskPageProps = {
	interventionSlug: string;
	task: Task;
	hours: Hour[];
	users: {
		id: number;
		firstname: string;
		lastname: string;
	}[];
};

const TaskPage = ({ task, users, hours, interventionSlug }: TaskPageProps) => {
	const [details, setDetails] = useState(task.details || "");
	const [openConfirm, setOpenConfirm] = useState(false);

	const handleSave = () => {
		router.patch(`/tasks/${task.id}/details`, {
			details,
		});
	};

	const handleDelete = () => {
		router.delete(`/tasks/${interventionSlug}/${task.id}`);
	};

	return (
		<>
			<Head title={task.name} />
			<PageHeader
				title={task.name}
				subtitle={task.taskGroup.name}
				tag={
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
							}
				}
				backButton={{
					route: `/interventions/${task.taskGroup.intervention.slug}/taches`,
				}}
				buttons={[
					task.status === "IN_PROGRESS"
						? {
								label: "Marquer comme terminée",
								onClick: () => router.patch(`/tasks/${task.id}/check`),
								icon: <CircleCheck size="20" />,
							}
						: {
								label: "Marquer comme à faire",
								onClick: () => router.patch(`/tasks/${task.id}/uncheck`),
								icon: <Clock size="20" />,
								variant: "secondary",
							},
					{
						label: "Supprimer",
						onClick: () => setOpenConfirm(true),
						icon: <Trash size="20" />,
						variant: "danger",
					},
				]}
			/>
			<div className="space-y-2">
				<Section title="Détails" icon={<File />} className="space-y-4">
					<Textarea
						value={details}
						onChange={(e) => setDetails(e.target.value)}
						placeholder="Détails"
					/>
					<Button icon={<Save />} onClick={handleSave}>
						Sauvegarder
					</Button>
				</Section>
				<Section title="Ajouter des heures" icon={<ClockPlus />}>
					<AddHourForm users={users} taskId={task.id} />
				</Section>
				<Section title="Historique des heures" icon={<CalendarClock />}>
					{hours.length === 0 ? (
						<p>Pas d'heures enregistrées</p>
					) : (
						<HourList hours={hours} />
					)}
				</Section>
			</div>
			<ConfirmModal
				title="Supprimer la tâche"
				open={openConfirm}
				confirmationText="Confirmer la suppression de la tâche ?"
				label="Confirmer"
				onClose={() => setOpenConfirm(false)}
				onConfirm={handleDelete}
			/>
		</>
	);
};

TaskPage.layout = (page: React.ReactNode & { props: TaskPageProps }) => (
	<AppLayout title="Gérer la tâche">{page}</AppLayout>
);

export default TaskPage;
