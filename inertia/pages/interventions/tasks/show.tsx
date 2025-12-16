import { Head, router } from "@inertiajs/react";
import { CircleCheck, Clock } from "lucide-react";
import type { Hour, Task, TaskGroup } from "#types/intervention";
import UpdateTaskModal from "~/components/features/intervention/task/UpdateTaskModal";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import ConfirmModal from "~/components/ui/modals/Confirm";
import ActionSection from "~/components/ui/sections/ActionSection";
import useTask from "~/hooks/useTask";

type TaskPageProps = {
	interventionSlug: string;
	task: Task;
	hours: Hour[];
	taskGroups: TaskGroup[];
	users: {
		id: number;
		firstname: string;
		lastname: string;
	}[];
};

const TaskPage = ({
	taskGroups,
	task,
	users,
	hours,
	interventionSlug,
}: TaskPageProps) => {
	const { actionButtons, tag, currentModal, closeModal, Modals, handleDelete } =
		useTask({
			task,
			interventionSlug,
		});

	return (
		<>
			<Head title={task.name} />
			<PageHeader
				title={task.name}
				subtitle={task.taskGroup.name}
				tag={tag}
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
				]}
			/>
			<div className="flex flex-col md:flex-row gap-4 w-full">
				<div className="w-2/3 space-y-4">
					{/* <Section title="Détails" icon={<File />} className="space-y-4">
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
				 */}
				</div>
				<div className="w-1/3">
					<ActionSection title="Actions" buttons={actionButtons} />
				</div>
			</div>
			<ConfirmModal
				title="Supprimer la tâche"
				open={currentModal === Modals.ConfirmDeletion}
				confirmationText="Confirmer la suppression de la tâche ?"
				label="Confirmer"
				onClose={closeModal}
				onConfirm={handleDelete}
			/>
			<UpdateTaskModal
				interventionSlug={interventionSlug}
				task={task}
				taskGroups={taskGroups}
				open={currentModal === Modals.UpdateModal}
				onClose={closeModal}
			/>
		</>
	);
};

TaskPage.layout = (page: React.ReactNode & { props: TaskPageProps }) => (
	<AppLayout title="Gérer la tâche">{page}</AppLayout>
);

export default TaskPage;
