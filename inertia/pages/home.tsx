import { Head } from "@inertiajs/react";
import AppLayout from "~/components/layout/AppLayout";

const title = "Tableau de bord";

interface Version {
	id: number;
	name: string;
	content: string;
	createdAt: string; // Vérifie si c'est created_at ou createdAt selon ton sérialiseur
}

const HomePage = ({ lastVersion }: { lastVersion: Version | null }) => {
	return (
		<>
			<Head title={title} />

			{/* Container avec padding adaptatif (px-4 sur mobile, px-6+ sur desktop) */}
			<div className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
				<header className="mb-6 sm:mb-8 border-b pb-4">
					<h1 className="text-xl sm:text-2xl font-bold italic text-gray-800">
						Tableau d'affichage
					</h1>
					{lastVersion && (
						<p className="text-xs text-gray-400 mt-1">
							Mis à jour le{" "}
							{new Date(lastVersion.createdAt).toLocaleDateString()}
						</p>
					)}
				</header>

				{lastVersion ? (
					<div className="bg-white shadow-sm rounded-xl border border-gray-100">
						{/* Padding adaptatif : p-4 sur petit écran, p-8 sur desktop.
                L'overflow-x-auto est CRUCIAL pour les tableaux générés par Quill sur mobile.
            */}
						<div className="p-5 sm:p-8 lg:p-10 overflow-visible">
							{" "}
							{/* On peut retirer overflow-x-auto si on veut forcer le wrap */}
							<article
								className="
    prose break-all

  "
								/* biome-ignore lint/security/noDangerouslySetInnerHtml: Contenu admin */
								dangerouslySetInnerHTML={{
									__html: lastVersion.content,
								}}
							/>
						</div>
					</div>
				) : (
					<div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
						<p className="text-gray-500 italic">
							Aucune instruction disponible.
						</p>
					</div>
				)}
			</div>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default HomePage;
