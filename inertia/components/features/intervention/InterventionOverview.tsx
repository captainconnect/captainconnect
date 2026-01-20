import { Contact, FileText, MapPin } from "lucide-react";
import type { Intervention } from "#types/intervention";
import { getBoatTypeIcon } from "~/app/utils";
import SuspendModal from "~/components/layout/SuspendModal";
import InformationsBlock from "~/components/ui/InformationsBlock";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useIntervention from "~/hooks/useIntervention";
import BoatMap from "../boat/BoatMap";
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
	} = useIntervention(intervention, mediasCount, onDelete);

	const hasPlace =
		intervention.boat.place !== null &&
		!Number.isNaN(Number(intervention.boat.place));
	const hasPosition = intervention.boat.position !== null;

	return (
		<>
			<div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
				<Section
					className="md:w-2/3"
					title="Détails de l'intervention"
					icon={<FileText />}
				>
					<InformationsBlock
						showUndefined={false}
						display="BLOCK"
						data={interventionData}
					/>
				</Section>
				<ActionSection
					className="md:w-1/3"
					title="Actions"
					buttons={actionsButtons}
				/>
			</div>
			<div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
				<Section
					icon={getBoatTypeIcon(intervention.boat.type?.label)}
					title="Détails du bateau"
					className="md:w-2/3 space-y-2"
				>
					<InformationsBlock
						showUndefined={false}
						display="GRID"
						data={boatData}
					/>
				</Section>
				{intervention.boat.contact && (
					<Section
						icon={<Contact size="30" />}
						title="Contact"
						className="md:w-1/3"
					>
						<InformationsBlock
							showUndefined={false}
							display="GRID"
							data={contactData}
						/>
					</Section>
				)}
			</div>
			<div>
				{(hasPlace || hasPosition) && (
					<Section
						title="Position dans le port"
						subtitle="Basé sur le quai/panne/position"
						icon={<MapPin />}
					>
						<BoatMap boat={intervention.boat} />
					</Section>
				)}
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
		</>
	);
}
