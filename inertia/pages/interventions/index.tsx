import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { Head } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import InterventionList from "~/components/features/intervention/InterventionList";
import AppLayout from "~/components/layout/AppLayout";
import InterventionIndexHeader from "~/components/layout/intervention/InterventionIndexHeader";
import EmptyList from "~/components/ui/EmptyList";

type InterventionIndexPageProps = {
	interventions: Intervention[];
	meta: SimplePaginatorMetaKeys;
};

const title = "Interventions";

const InterventionsIndexPage = ({
	interventions,
	meta,
}: InterventionIndexPageProps) => {
	const [showPriority, setShowPriority] = useState(false);
	return (
		<>
			<Head title={title} />
			<InterventionIndexHeader
				meta={meta}
				setShowPriority={setShowPriority}
				showPriority={showPriority}
			/>
			{interventions.length === 0 ? (
				<EmptyList
					icon={<Wrench size="48" />}
					text="Pas encore d'intervention. Créez votre première intervention sur la page
				d'un bateau."
				/>
			) : (
				<InterventionList
					showPriority={showPriority}
					interventions={interventions}
				/>
			)}
		</>
	);
};

InterventionsIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default InterventionsIndexPage;
