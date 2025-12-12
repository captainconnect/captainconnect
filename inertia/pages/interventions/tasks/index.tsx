import { Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import TaskModal from "~/components/features/intervention/TaskModal";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";

const title = "Travaux à faire";

type IndexTaskPageProps = {
	intervention: Intervention;
};

const IndexTaskPage = ({ intervention }: IndexTaskPageProps) => {
	const [openTaskModal, setOpenTaskModal] = useState(false);

	const taskGroups = intervention.taskGroups || [];

	return (
		<>
			<Head title={title} />
			<PageHeader
				title={`${intervention.taskGroups.length} groupes`}
				buttons={[
					{
						label: "Ajouter une nouvelle tâche",
						onClick: () => setOpenTaskModal(true),
						icon: <Plus />,
					},
				]}
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
