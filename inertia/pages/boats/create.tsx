import { Head } from "@inertiajs/react";
import { Ship } from "lucide-react";
import type { BoatConstructor, BoatType } from "#types/boat";
import type { Contact } from "#types/contact";
import CreateBoatForm from "~/components/features/boat/CreateBoatForm";
import AppLayout from "~/components/layout/AppLayout";
import BackButton from "~/components/ui/buttons/BackButton";
import IconBadge from "~/components/ui/IconBadge";

type CreateBoatPageProps = {
	contacts: Contact[];
	boatTypes: BoatType[];
	boatConstructors: BoatConstructor[];
};

const title = "Ajouter un bateau";

const CreateBoatPage = ({
	contacts,
	boatTypes,
	boatConstructors,
}: CreateBoatPageProps) => {
	return (
		<>
			<Head title={title} />
			<section className="bg-white space-y-4 w-full rounded-xl p-6 border border-gray-200">
				<div className="flex gap-4">
					<BackButton route="/bateaux" />
					<IconBadge icon={<Ship />} />
					<div className="flex flex-col justify-center">
						<h3 className="text-lg font-semibold">Informations du bateau</h3>
						<p className="text-slate-500">
							Complétez les informations du bateau
						</p>
					</div>
				</div>
				<CreateBoatForm
					boatConstructors={boatConstructors}
					boatTypes={boatTypes}
					contacts={contacts}
				/>
			</section>
		</>
	);
};

CreateBoatPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default CreateBoatPage;
