import { Head, router } from "@inertiajs/react";
import { CircleCheck, Clock, FilePlus, Wrench } from "lucide-react";
import { useState } from "react";
import type WorkDone from "#models/work_done";
import type { Intervention, Task, TaskGroup } from "#types/intervention";
import type { User } from "#types/user";
import AddWorkDoneForm from "~/components/features/intervention/task/AddWorkDoneForm";
import UpdateTaskModal from "~/components/features/intervention/task/UpdateTaskModal";
import WorkDoneCard from "~/components/features/intervention/task/WorkDoneCard";
import AddProjectMediaModal from "~/components/features/media/AddProjectMediaModal";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useTask from "~/hooks/useTask";

type TaskPageProps = {
	interventionSlug: string;
	task: Task;
	workDones: WorkDone[];
	taskGroups: TaskGroup[];
	users: User[];
	intervention: Intervention;
};

const TaskPage = ({
	taskGroups,
	task,
	users,
	intervention,
	interventionSlug,
}: TaskPageProps) => {
	const [addWorkDoneFormVisible, setAddWorkDoneFormVisible] = useState(false);

	const {
		actionButtons,
		tag,
		currentModal,
		closeModal,
		Modals,
		handleDelete,
		getWorkDones,
	} = useTask({
		task,
		interventionSlug,
	});

	const workDones = getWorkDones();

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
					{
						label: "Ajouter des travaux effectués",
						icon: <FilePlus size="20" />,
						variant: "secondary",
						disabled: addWorkDoneFormVisible === true || task.status === "DONE",
						onClick: () => setAddWorkDoneFormVisible(true),
					},
					task.status === "IN_PROGRESS"
						? {
								label: "Marquer comme terminée",
								disabled:
									(task.workDones && task.workDones.length === 0) ||
									addWorkDoneFormVisible === true,
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
				<div className="md:w-2/3 space-y-4">
					{addWorkDoneFormVisible ? (
						<Section
							className="transition"
							title="Ajouter des travaux effectués"
							icon={<FilePlus />}
						>
							<AddWorkDoneForm
								interventionSlug={interventionSlug}
								taskId={task.id}
								users={users}
								onClose={() => setAddWorkDoneFormVisible(false)}
							/>
						</Section>
					) : workDones.length < 1 ? (
						<EmptyList
							icon={<Wrench size="48" />}
							text="Aucun travail effectué"
						/>
					) : (
						workDones.map((wd) => <WorkDoneCard key={wd.id} workDone={wd} />)
					)}
				</div>
				<div className=" md:w-1/3 space-y-4">
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
			<AddProjectMediaModal
				open={currentModal === Modals.AddMediaModal}
				onClose={closeModal}
				boatId={intervention.boat.id}
				interventionId={intervention.id}
				taskId={task.id}
			/>
		</>
	);
};

TaskPage.layout = (page: React.ReactNode & { props: TaskPageProps }) => (
	<AppLayout title="Gérer la tâche">{page}</AppLayout>
);

export default TaskPage;
