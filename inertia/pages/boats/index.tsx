import { Head } from "@inertiajs/react";
import { Plus, Ship } from "lucide-react";
import { useState } from "react";
import type { Boat } from "#types/boat";
import BoatList from "~/components/features/boat/BoatList";
import AppLayout from "~/components/layout/AppLayout";
import PageHeader from "~/components/layout/PageHeader";
import EmptyList from "~/components/ui/EmptyList";

type BoatIndexPageProps = {
	boats: Boat[];
};

const title = "Bateaux";

const BoatIndexPage = ({ boats }: BoatIndexPageProps) => {
	const [search, setSearch] = useState("");
	const [filteredBoats, setFilteredBoats] = useState<Boat[]>(boats);

	const handleSearch = (value: string) => {
		setSearch(value);
		const query = value.toLowerCase().trim();
		setFilteredBoats(
			boats.filter(
				(b) =>
					b.name.toLowerCase().includes(query) ||
					b.type?.label.toLowerCase().includes(query) ||
					b.contact?.company?.toLowerCase().includes(query) ||
					b.contact?.fullName?.toLowerCase().includes(query) ||
					b.boatConstructor?.name.toLowerCase().includes(query) ||
					b.model?.toLowerCase().includes(query),
			),
		);
	};

	return (
		<>
			<Head title={title} />
			<PageHeader
				title="Liste des bateaux"
				subtitle="Gérez les bateaux clients"
				search={{
					disabled: boats.length === 0,
					onChange: (value) => handleSearch(value),
					placeholder: "Rechercher un bateau",
					value: search,
				}}
				buttons={[
					{
						href: "/bateaux/nouveau",
						icon: <Plus size="18" />,
						label: "Nouveau bateau",
					},
				]}
			/>
			{boats.length === 0 ? (
				<EmptyList
					icon={<Ship size="48" />}
					text="Pas de bateaux existants. Créez votre premier bateau pour commencer."
				/>
			) : (
				<BoatList boats={filteredBoats} />
			)}
		</>
	);
};

BoatIndexPage.layout = (page: React.ReactNode) => (
	<AppLayout title={title}>{page}</AppLayout>
);

export default BoatIndexPage;
