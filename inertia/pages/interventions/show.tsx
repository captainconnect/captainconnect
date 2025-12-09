import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import type { User } from "#types/user";
import OverviewTab from "~/components/features/intervention/overview_tab/OverviewTab";
import TaskTab from "~/components/features/intervention/TaskTab";
import AppLayout from "~/components/layout/AppLayout";
import InformationCard from "~/components/layout/intervention/InformationCard";
import InterventionCardSection from "~/components/layout/intervention/InformationCardSection";
import InterventionHeader from "~/components/layout/intervention/InterventionHeader";
import ConfirmModal from "~/components/ui/modals/Confirm";
import TabSelector from "~/components/ui/TabSelector";
import useIntervention from "~/hooks/useIntervention";

type InterventionPageProps = {
	intervention: Intervention;
	users: User[];
};

const title = "Intervention";

const InterventionPage = ({ intervention, users }: InterventionPageProps) => {
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const { cards } = useIntervention(intervention, setDeleteModalOpen);
	const hash = window.location.hash.replace("#", "");
	const [selectedTab, setSelectedTab] = useState(
		hash !== "" ? hash : "OVERVIEW",
	);

	const handleDelete = () => {
		router.delete(`/interventions/${intervention.slug}`);
	};

	return (
		<>
			<Head title={`${intervention.boat.name} - Intervention`} />
			<InterventionHeader intervention={intervention} />
			<hr className="text-gray-200 m-5" />
			<InterventionCardSection className="justify-between">
				<div className="overflow-x-auto flex gap-4 items-center">
					{cards.map((c) => (
						<InformationCard
							key={c.title}
							title={c.title}
							icon={c.icon}
							data={c.data}
							alert={c.alert}
						/>
					))}
				</div>
			</InterventionCardSection>
			<hr className="text-gray-200 m-5" />
			<div className="flex bg-gray-100 rounded-xl mb-5 w-full p-1">
				<TabSelector
					isSelected={selectedTab === "OVERVIEW"}
					scope="OVERVIEW"
					setSelectedTab={setSelectedTab}
					label="Vue d'ensemble"
				/>
				<TabSelector
					isSelected={selectedTab === "TASKS"}
					scope="TASKS"
					setSelectedTab={setSelectedTab}
					label="Tâches"
				/>
				<TabSelector
					disabled={true}
					isSelected={selectedTab === "MEDIAS"}
					scope="MEDIAS"
					setSelectedTab={setSelectedTab}
					label="Médias"
				/>
			</div>
			<OverviewTab
				intervention={intervention}
				selected={selectedTab === "OVERVIEW"}
				openModal={setDeleteModalOpen}
			/>
			<TaskTab
				users={users}
				selected={selectedTab === "TASKS"}
				intervention={intervention}
			/>
			<ConfirmModal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Supprimer l'intervention"
				label="Confirmer"
				confirmationText="Confirmer la suppression de l'intervention ?"
				onConfirm={handleDelete}
			/>
		</>
	);
};

InterventionPage.layout = (
	page: React.ReactNode & { page: InterventionPageProps },
) => <AppLayout title={title}>{page}</AppLayout>;

export default InterventionPage;
