import { Contact, FileText, Sailboat, Ship } from "lucide-react";
import type { Intervention } from "#types/intervention";
import InformationsBlock from "~/components/ui/InformationsBlock";
import Section from "~/components/ui/Section";
import ActionSection from "~/components/ui/sections/ActionSection";
import useIntervention from "~/hooks/useIntervention";
import AddProjectMediaModal from "../media/AddProjectMediaModal";

type OverviewTabProps = {
	intervention: Intervention;
	openModal: (open: boolean) => void;
	mediasCount: number;
};

export default function InterventionOverview({
	intervention,
	openModal,
	mediasCount,
}: OverviewTabProps) {
	const {
		actionsButtons,
		boatData,
		contactData,
		interventionData,
		addProjectMediaModalOpen,
		setAddProjectMediaModalOpen,
	} = useIntervention(intervention, openModal, mediasCount);

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
					icon={
						intervention.boat.type?.label === "Voilier" ||
						intervention.boat.type?.label === "Catamaran" ? (
							<Sailboat size="30" />
						) : (
							<Ship size="30" />
						)
					}
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
			<AddProjectMediaModal
				open={addProjectMediaModalOpen}
				onClose={() => setAddProjectMediaModalOpen(false)}
				boatId={intervention.boat.id}
				interventionId={intervention.id}
			/>
		</>
	);
}
