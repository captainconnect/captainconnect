import { Head, Link } from "@inertiajs/react";
import { File, Ship } from "lucide-react";
import type { Boat } from "#types/boat";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";
import IconBadge from "~/components/ui/IconBadge";

const title = "Fichiers";

type MediaIndexPageProps = {
	boats: Boat[];
};

const MediaIndexPage = ({ boats }: MediaIndexPageProps) => {
	return (
		<>
			<Head title={title} />
			<PageHeader
				title="Liste des bateaux"
				subtitle="Sélectionnez un bateau pour consulter ses fichiers."
			/>
			{boats.length > 0 ? (
				<ul className="space-y-2">
					{boats.map((boat) => (
						<li key={boat.id} className="w-full">
							<Link
								href={`/fichiers/${boat.slug}`}
								className="flex items-center gap-6 bg-white rounded-xl border border-gray-300  p-4 cursor-pointer hover:shadow-sm transition active:scale-[99%]"
							>
								<IconBadge icon={<File />} />
								<h3 className="text-lg font-semibold">{boat.name}</h3>
								<p>{boat.medias_count ?? 0} Fichiers</p>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<EmptyList
					text="Il n'y a aucun fichier lié à un bateau actuellement"
					icon={<Ship size="48" />}
				/>
			)}
		</>
	);
};

MediaIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default MediaIndexPage;
