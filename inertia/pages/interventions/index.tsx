import { Head } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Intervention } from "#types/intervention";
import InterventionList from "~/components/features/intervention/InterventionList";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";

type InterventionIndexPageProps = {
	interventions: Intervention[];
};

const title = "Interventions";

const InterventionsIndexPage = ({
	interventions,
}: InterventionIndexPageProps) => {
	return (
		<>
			<Head title={title} />
			<PageHeader
				title="Liste des interventions"
				subtitle="Interventions en cours"
			/>
			{interventions.length === 0 ? (
				<EmptyList
					icon={<Wrench size="48" />}
					text="Pas encore d'intervention. Créez votre première intervention sur la page
				d'un bateau."
				/>
			) : (
				<InterventionList interventions={interventions} />
			)}
		</>
	);
};

InterventionsIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default InterventionsIndexPage;
