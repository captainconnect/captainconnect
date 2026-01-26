import { Head, router } from "@inertiajs/react";
import { CircleAlert, Contact, MapPin, Phone, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import type { Boat } from "#types/boat";
import { getBoatTypeIcon } from "~/app/utils";
import BoatMap from "~/components/features/boat/BoatMap";
import UploadBoatThumbnailModal from "~/components/features/boat/UploadBoatThumbnailModal";
import ShowContactModal from "~/components/features/contact/modals/ShowContactModal";
import BoatInterventionList from "~/components/features/intervention/BoatInterventionList";
import AddProjectMediaModal from "~/components/features/media/AddProjectMediaModal";
import AppLayout from "~/components/layout/AppLayout";
import BoatPageHeader from "~/components/layout/boat/BoatPageHeader";
import Button from "~/components/ui/buttons/Button";
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
	const hasPlace = boat.place !== null && !Number.isNaN(Number(boat.place));
	const hasPosition = boat.position !== null;

	let positionType: "gps" | "place" | "panne" | null = null;

	if (hasPlace) {
		const placeNumber = Number(boat.place);
		if (placeNumber >= 1 && placeNumber <= 9) {
			positionType = "panne";
		} else {
			positionType = "place";
		}
	} else if (hasPosition) {
		positionType = "gps";
	}

	const inProgressInterventions = boat.interventions.filter(
		(i) => i.status === "IN_PROGRESS" || i.status === "SUSPENDED",
	);

	const completedInterventions = boat.interventions.filter(
		(i) => i.status === "DONE",
	);

	const {
		boatData,
		moreBoatData,
		contactData,
		actionButtons,
		dangerActionsButtons,
		currentModal,
		setCurrentModal,
		Modals,
	} = useBoatInformations(boat);

	const handleDelete = () => {
		router.delete(`/bateaux/${boat.slug}`);
	};

	useEffect(() => {
		document.getElementById("app-main")?.scrollTo(0, 0);
	}, []);

	const [showMoreBoatData, setShowMoreBoatData] = useState(false);

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
						image={boat.thumbnailUrl}
						icon={getBoatTypeIcon(boat.type?.label)}
						title="Informations du bateau"
						subtitle="Détails techniques et caractéristiques"
					>
						<InformationsBlock data={boatData} />
						<div className={showMoreBoatData ? "block" : "hidden"}>
							<InformationsBlock data={moreBoatData} />
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
						</div>
						<Button
							variant="secondary"
							className="mt-4"
							onClick={() => setShowMoreBoatData(!showMoreBoatData)}
						>
							{`Afficher ${showMoreBoatData ? "moins" : "plus"} d'infos`}
						</Button>
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
					{(hasPlace || hasPosition) && (
						<Section
							title="Position dans le port"
							subtitle={`Basé sur ${positionType === "panne" ? "la panne" : positionType === "place" ? "la place" : positionType === "gps" ? "la position GPS" : "aucun"}`}
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
						<button
							onClick={() => setCurrentModal(Modals.Contact)}
							type="button"
							className="block w-full cursor-pointer"
						>
							<Section
								className="text-left"
								title="Contact"
								subtitle="Informations du contact"
								icon={<Contact />}
							>
								<InformationsBlock
									showUndefined={false}
									display="BLOCK"
									data={contactData}
								/>
								<a
									href={`tel:${boat.contact.phone}`}
									onClick={(e) => {
										e.stopPropagation();
									}}
									className="flex items-center justify-center gap-2 font-semibold rounded-2xl border-2 transition active:scale-95 cursor-pointer text-sm w-auto max-h-10  px-4 py-2 sm:px-5 bg-primary border-transparent text-white hover:bg-primary-hover mt-4"
								>
									<Phone size="20" />
									Appeler
								</a>
							</Section>
						</button>
					)}

					<ActionSection title="Actions" buttons={actionButtons} />

					<ActionSection
						mustBeAdmin={true}
						title="Danger zone"
						buttons={dangerActionsButtons}
					/>
				</div>
			</div>
			<ConfirmModal
				open={currentModal === Modals.DeleteBoat}
				onClose={() => setCurrentModal(Modals.None)}
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
			<AddProjectMediaModal
				onClose={() => setCurrentModal(Modals.None)}
				open={currentModal === Modals.AddMedia}
				boatId={boat.id}
			/>
			<UploadBoatThumbnailModal
				hasThumbnail={!!boat.thumbnail}
				boatId={boat.id}
				open={currentModal === Modals.UpdateThumbnail}
				onClose={() => setCurrentModal(Modals.None)}
			/>
			{boat.contact && (
				<ShowContactModal
					open={currentModal === Modals.Contact}
					onClose={() => setCurrentModal(Modals.None)}
					contact={boat.contact}
				/>
			)}
		</>
	);
};

BoatPage.layout = (page: React.ReactNode & { props: BoatPageProps }) => {
	const { boat } = page.props;
	return <AppLayout title={`Détails - ${boat.name}`}>{page}</AppLayout>;
};

export default BoatPage;
