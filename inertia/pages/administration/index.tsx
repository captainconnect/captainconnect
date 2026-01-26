import { Head, Link } from "@inertiajs/react";
import { FileText, ListOrdered } from "lucide-react";
import AppLayout from "~/components/layout/AppLayout";

const AdministrationIndexPage = () => {
	return (
		<>
			<Head title="Administration" />
			<div className="flex items-center gap-4">
				<Link
					href=""
					className="w-1/4 flex items-center justify-center flex-col p-10 bg-white border border-gray-200 rounded-2xl gap-4"
					disabled={true}
				>
					<div className="flex items-center justify-center rounded-xl size-14 bg-gray-200">
						<FileText />
					</div>
					<div className="flex flex-col items-center gap-2">
						<h4 className="text-lg font-semibold">Tableau de bord</h4>
						<p className="text-sm text-gray-500">
							Éditer le document du tableau de bord
						</p>
					</div>
				</Link>
				<Link
					href="/administration/interventions"
					className="flex items-center justify-center w-1/4 flex-col p-10 bg-white border border-gray-200 rounded-2xl gap-4"
				>
					<div className="flex items-center justify-center rounded-xl size-14 bg-gray-200">
						<ListOrdered />
					</div>
					<div className="flex flex-col items-center gap-2">
						<h4 className="text-lg font-semibold">Ordre des interventions</h4>
						<p className="text-sm text-gray-500">
							Organiser l'ordre d'affichage des interventions
						</p>
					</div>
				</Link>
			</div>
		</>
	);
};

AdministrationIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title="Administration">{page}</AppLayout>
);

export default AdministrationIndexPage;
