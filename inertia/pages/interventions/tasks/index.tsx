import { Head, router } from "@inertiajs/react";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Intervention, TaskGroup } from "#types/intervention";
import TaskModal from "~/components/features/intervention/TaskModal";
import TaskBoard from "~/components/features/intervention/task/TaskBoard";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";

const title = "Tâches";

export type IndexTaskPageProps = {
	intervention: Intervention;
};

const IndexTaskPage = ({ intervention }: IndexTaskPageProps) => {
	const [openTaskModal, setOpenTaskModal] = useState(false);
	const [orderingEnabled, setOrderingEnabled] = useState(false);

	// source de vérité UI pour l’ordre
	const initialTaskGroups = useMemo<TaskGroup[]>(
		() => intervention.taskGroups || [],
		[intervention.taskGroups],
	);

	const [groups, setGroups] = useState<TaskGroup[]>(initialTaskGroups);

	// si la page reçoit de nouvelles props (reload inertia, ajout tâche, etc.)
	useEffect(() => {
		if (!orderingEnabled) {
			setGroups(initialTaskGroups);
		}
	}, [initialTaskGroups, orderingEnabled]);

	function saveOrdering() {
		const payload = {
			groups: groups.map((g, groupIndex) => ({
				id: g.id,
				order: groupIndex,
				tasks: (g.tasks || []).map((t, taskIndex) => ({
					id: t.id,
					order: taskIndex,
				})),
			})),
		};

		router.put(`/interventions/${intervention.slug}/tasks/ordering`, payload, {
			preserveScroll: true,
			onSuccess: () => setOrderingEnabled(false),
		});
	}

	const taskGroups = intervention.taskGroups || [];

	return (
		<>
			<Head title={title} />
			<PageHeader
				backButton={{ route: `/interventions/${intervention.slug}` }}
				title="Travaux à faire"
				subtitle="Liste des tâches organisées par groupes"
				buttons={[
					...(orderingEnabled
						? [
								{
									label: "Sauvegarder",
									onClick: saveOrdering,
									icon: <Save size="20" />,
									variant: "secondary" as const,
								},
							]
						: [
								{
									label: "Modifier l'ordre",
									onClick: () => setOrderingEnabled(true),
									icon: <Pencil size="18" />,
									variant: "secondary" as const,
								},
							]),
					{
						label: "Ajouter une nouvelle tâche",
						onClick: () => setOpenTaskModal(true),
						icon: <Plus />,
					},
				]}
			/>

			<TaskBoard
				orderingEnabled={orderingEnabled}
				groups={groups}
				onGroupsChange={setGroups}
			/>

			<TaskModal
				interventionSlug={intervention.slug}
				taskGroups={taskGroups}
				open={openTaskModal}
				onClose={() => setOpenTaskModal(false)}
			/>
		</>
	);
};

IndexTaskPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default IndexTaskPage;
