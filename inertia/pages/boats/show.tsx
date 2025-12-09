import { Head, router } from "@inertiajs/react";
import {
	CircleAlert,
	Contact,
	MapPin,
	Sailboat,
	Ship,
	Wrench,
} from "lucide-react";
import { useState } from "react";
import type { Boat } from "#types/boat";
import BoatMap from "~/components/features/boat/BoatMap";
import BoatInterventionList from "~/components/features/intervention/BoatInterventionList";
import AppLayout from "~/components/layout/AppLayout";
import BoatPageHeader from "~/components/layout/boat/BoatPageHeader";
import EmptyList from "~/components/ui/EmptyList";
import InformationsBlock from "~/components/ui/InformationsBlock";
import ConfirmModal from "~/components/ui/modals/Confirm";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useBoatInformations from "~/hooks/useBoatInformations";

type BoatPageProps = {
	boat: Boat;
};

const BoatPage = ({ boat }: BoatPageProps) => {
	const inProgressInterventions = boat.interventions.filter(
		(i) => i.status === "IN_PROGRESS" || i.status === "SUSPENDED",
	);

	const completedInterventions = boat.interventions.filter(
		(i) => i.status === "DONE",
	);

	const [deleteBoatConfirmationModalOpen, setDeleteBoatConfirmationModalOpen] =
		useState(false);

	const { boatData, contactData, actionButtons, dangerActionsButtons } =
		useBoatInformations(boat, setDeleteBoatConfirmationModalOpen);

	const handleDelete = () => {
		router.delete(`/bateaux/${boat.slug}`);
	};

	return (
		<>
			<Head title={boat.name} />
			<BoatPageHeader
				inProgressInterventions={inProgressInterventions}
				boat={boat}
			/>
			<div className="flex flex-col md:flex-row gap-4 mt-6">
				<div className="flex-2 space-y-4">
					<Section
						icon={
							boat.type?.label === "Voilier" ||
							boat.type?.label === "Catamaran" ? (
								<Sailboat />
							) : (
								<Ship />
							)
						}
						title="Informations du bateau"
						subtitle="Détails techniques et caractéristiques"
					>
						<InformationsBlock data={boatData} />
						<hr className="text-gray-200 m-5" />
						<div className="space-y-2">
							<p className="text-slate-500 flex items-center gap-2">
								<CircleAlert size="14" /> Notes & Observations
							</p>
							{boat.note ? (
								<p className="font-semibold">{boat.note}</p>
							) : (
								<p className="font-semibold">Aucune notes</p>
							)}
						</div>
					</Section>
					{inProgressInterventions.length !== 0 && (
						<Section
							title="Interventions"
							subtitle="Interventions en cours"
							icon={<Wrench />}
						>
							<BoatInterventionList interventions={inProgressInterventions} />
						</Section>
					)}
					{boat.place !== null && !Number.isNaN(Number(boat.place)) && (
						<Section
							title="Position dans le port"
							subtitle="Basé sur le quai/panne/position"
							icon={<MapPin />}
						>
							<BoatMap boat={boat} />
						</Section>
					)}
					<Section
						title="Historique des interventions"
						subtitle="Interventions complétées"
						icon={<Wrench />}
					>
						{completedInterventions.length ? (
							<BoatInterventionList interventions={completedInterventions} />
						) : (
							<EmptyList
								nested={true}
								icon={<Wrench size="48" />}
								text="Aucun historique d'interventions"
							/>
						)}
					</Section>
				</div>
				<div className="flex-1 space-y-4">
					{boat.contact && (
						<Section
							title="Contact associé"
							subtitle="Informations du contact"
							icon={<Contact />}
						>
							<InformationsBlock
								showUndefined={false}
								display="BLOCK"
								data={contactData}
							/>
						</Section>
					)}
					<ActionSection title="Actions" buttons={actionButtons} />
					<ActionSection title="Danger zone" buttons={dangerActionsButtons} />
				</div>
			</div>
			<ConfirmModal
				open={deleteBoatConfirmationModalOpen}
				onClose={() => setDeleteBoatConfirmationModalOpen(false)}
				title={`Supprimer ${boat.name}`}
				label="Confirmer"
				confirmationText={
					boat.interventions.length
						? `Vous supprimez également ${boat.interventions.length} interventions associées`
						: `Confirmer la suppression de ${boat.name} ?`
				}
				confirmationType={{
					placeholder: `Veuillez écrire ${boat.name} pour confirmer`,
					value: boat.name,
				}}
				onConfirm={handleDelete}
			/>
		</>
	);
};

BoatPage.layout = (page: React.ReactNode & { props: BoatPageProps }) => {
	const { boat } = page.props;
	return <AppLayout title={`Détails - ${boat.name}`}>{page}</AppLayout>;
};

export default BoatPage;
