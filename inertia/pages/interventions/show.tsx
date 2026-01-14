import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import InterventionOverview from "~/components/features/intervention/InterventionOverview";
import AppLayout from "~/components/layout/AppLayout";
import InformationCard from "~/components/layout/intervention/InformationCard";
import InterventionCardSection from "~/components/layout/intervention/InformationCardSection";
import InterventionHeader from "~/components/layout/intervention/InterventionHeader";
import ConfirmModal from "~/components/ui/modals/Confirm";
import useIntervention from "~/hooks/useIntervention";

type InterventionPageProps = {
	intervention: Intervention;
	mediasCount: number;
};

const title = "Intervention";

const InterventionPage = ({
	intervention,
	mediasCount,
}: InterventionPageProps) => {
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	const { cards } = useIntervention(intervention, setDeleteModalOpen);

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
							link={c.link}
						/>
					))}
				</div>
			</InterventionCardSection>
			<hr className="text-gray-200 m-5" />
			<InterventionOverview
				intervention={intervention}
				openModal={setDeleteModalOpen}
				mediasCount={mediasCount}
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
