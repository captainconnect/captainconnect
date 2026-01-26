import { Link } from "@inertiajs/react";
import { Contact, FileText, MapPin, Phone } from "lucide-react";
import type { Intervention } from "#types/intervention";
import { getBoatTypeIcon } from "~/app/utils";
import SuspendModal from "~/components/layout/SuspendModal";
import InformationsBlock from "~/components/ui/InformationsBlock";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useIntervention from "~/hooks/useIntervention";
import BoatMap from "../boat/BoatMap";
import ShowContactModal from "../contact/modals/ShowContactModal";
import AddProjectMediaModal from "../media/AddProjectMediaModal";

type OverviewTabProps = {
	intervention: Intervention;
	mediasCount: number;
	onDelete: () => void;
};

export default function InterventionOverview({
	intervention,
	mediasCount,
	onDelete,
}: OverviewTabProps) {
	const {
		actionsButtons,
		boatData,
		contactData,
		interventionData,
		currentModal,
		closeModal,
		Modals,
		setCurrentModal,
	} = useIntervention(intervention, mediasCount, onDelete);

	const hasPlace =
		intervention.boat.place !== null &&
		!Number.isNaN(Number(intervention.boat.place));
	const hasPosition = intervention.boat.position !== null;

	let positionType: "gps" | "place" | "panne" | null = null;

	if (hasPlace) {
		const placeNumber = Number(intervention.boat.place);
		if (placeNumber >= 1 && placeNumber <= 9) {
			positionType = "panne";
		} else {
			positionType = "place";
		}
	} else if (hasPosition) {
		positionType = "gps";
	}

	return (
		<>
			<div className="flex flex-col md:flex-row gap-4 mt-6">
				<div className="flex-2 space-y-6">
					<Link href={`/interventions/${intervention.slug}/taches`}>
						<Section title="Détails de l'intervention" icon={<FileText />}>
							<InformationsBlock
								showUndefined={false}
								display="BLOCK"
								data={interventionData}
							/>
						</Section>
					</Link>
					<Link href={`/bateaux/${intervention.boat.slug}`}>
						<Section
							icon={getBoatTypeIcon(intervention.boat.type?.label)}
							title="Détails du bateau"
							className="space-y-2 mt-4"
						>
							<InformationsBlock
								showUndefined={false}
								display="GRID"
								data={boatData}
							/>
						</Section>
					</Link>
					<div className="mt-4">
						{(hasPlace || hasPosition) && (
							<Section
								title="Position dans le port"
								subtitle={`Basé sur ${positionType === "panne" ? "la panne" : positionType === "place" ? "la place" : positionType === "gps" ? "la position GPS" : "aucun"}`}
								icon={<MapPin />}
							>
								<BoatMap boat={intervention.boat} />
							</Section>
						)}
					</div>
				</div>
				<div className="flex-1  space-y-4">
					{intervention.boat.contact && (
						<button
							onClick={() => setCurrentModal(Modals.Contact)}
							type="button"
							className="block w-full cursor-pointer text-left"
						>
							<Section icon={<Contact size="30" />} title="Contact">
								<InformationsBlock
									showUndefined={false}
									display="GRID"
									data={contactData}
								/>
								<a
									href={`tel:${intervention.boat.contact.phone}`}
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
					<ActionSection title="Actions" buttons={actionsButtons} />
				</div>
			</div>

			<AddProjectMediaModal
				open={currentModal === Modals.AddMediaModal}
				onClose={closeModal}
				boatId={intervention.boat.id}
				interventionId={intervention.id}
			/>
			<SuspendModal
				interventionSlug={intervention.slug}
				scope="intervention"
				open={currentModal === Modals.SuspendIntervention}
				onClose={closeModal}
			/>
			{intervention.boat.contact && (
				<ShowContactModal
					open={currentModal === Modals.Contact}
					onClose={() => setCurrentModal(Modals.None)}
					contact={intervention.boat.contact}
				/>
			)}
		</>
	);
}
