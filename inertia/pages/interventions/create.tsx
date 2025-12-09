import { Head } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Boat } from "#types/boat";
import CreateInterventionForm from "~/components/features/intervention/CreateInterventionForm";
import AppLayout from "~/components/layout/AppLayout";
import CardHeader from "~/components/ui/CardHeader";

type CreateInterventionPageProps = {
	boat: Boat;
};

const CreateInterventionPage = ({ boat }: CreateInterventionPageProps) => {
	return (
		<>
			<Head title={`${boat.name} - Nouvelle intervention`} />
			<section className="bg-white space-y-4 w-full rounded-xl p-6 border border-gray-200">
				<CardHeader
					icon={<Wrench />}
					back={`/bateaux/${boat.slug}`}
					title="Informations de l'intervention"
					subtitle="Remplissez les informations de la nouvelle intervention"
				/>
				<CreateInterventionForm boat={boat} />
			</section>
		</>
	);
};

CreateInterventionPage.layout = (
	page: React.ReactNode & { props: CreateInterventionPageProps },
) => {
	const { boat } = page.props;
	return (
		<AppLayout title={`${boat.name} - Nouvelle intervention`}>{page}</AppLayout>
	);
};

export default CreateInterventionPage;
