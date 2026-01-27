import { Head, Link } from "@inertiajs/react";
import { FileText, ListOrdered } from "lucide-react";
import AppLayout from "~/components/layout/AppLayout";

const AdministrationIndexPage = () => {
	return (
		<>
			<Head title="Administration" />

			{/* Utilisation d'une grille : 1 colonne sur mobile, 2 sur tablette, 4 sur desktop */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-0">
				<Link
					href="/administration/tableau-de-bord"
					className="flex items-center justify-center flex-col p-6 sm:p-10 bg-white border border-gray-200 rounded-2xl gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
				>
					<div className="flex items-center justify-center rounded-xl size-14 bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
						<FileText />
					</div>
					<div className="flex flex-col items-center gap-2 text-center">
						<h4 className="text-lg font-semibold">Tableau de bord</h4>
						<p className="text-sm text-gray-500 leading-tight">
							Éditer le document du tableau de bord
						</p>
					</div>
				</Link>

				<Link
					href="/administration/interventions"
					className="flex items-center justify-center flex-col p-6 sm:p-10 bg-white border border-gray-100 rounded-2xl gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
				>
					<div className="flex items-center justify-center rounded-xl size-14 bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
						<ListOrdered />
					</div>
					<div className="flex flex-col items-center gap-2 text-center">
						<h4 className="text-lg font-semibold">Ordre des interventions</h4>
						<p className="text-sm text-gray-500 leading-tight">
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
