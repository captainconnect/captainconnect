import { Head } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Intervention } from "#types/intervention";
import EditInterventionForm from "~/components/features/intervention/EditInterventionForm";
import AppLayout from "~/components/layout/AppLayout";
import CardHeader from "~/components/ui/CardHeader";

type EditInterventionPageProps = {
	intervention: Intervention;
};

const EditInterventionPage = ({ intervention }: EditInterventionPageProps) => {
	return (
		<>
			<Head title={`${intervention.title} - Modifier l'intervention`} />
			<section className="bg-white space-y-4 w-full rounded-xl p-6 border border-gray-200">
				<CardHeader
					icon={<Wrench />}
					back={`/interventions/${intervention.slug}`}
					title="Informations de l'intervention"
					subtitle="Remplissez les informations de la nouvelle intervention"
				/>
				<EditInterventionForm intervention={intervention} />
			</section>
		</>
	);
};

EditInterventionPage.layout = (
	page: React.ReactNode & { props: EditInterventionPageProps },
) => {
	const { intervention } = page.props;

	return (
		<AppLayout title={`${intervention.title} - Modifier l'intervention`}>
			{page}
		</AppLayout>
	);
};

export default EditInterventionPage;
