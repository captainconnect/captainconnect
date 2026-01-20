import { Form } from "@inertiajs/react";
import { UserPen, X } from "lucide-react";
import { useState } from "react";
import type { BoatConstructor, BoatType, Coordinate } from "#types/boat";
import type { Contact } from "#types/contact";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import CreateContactModal from "../contact/modals/CreateContactModal";
import ManualSetPositionCard from "./ManualSetPositionCard";

type CreateBoatFormProps = {
	contacts: Contact[];
	boatConstructors: BoatConstructor[];
	boatTypes: BoatType[];
};

export default function CreateBoatForm({
	contacts,
	boatConstructors,
	boatTypes,
}: CreateBoatFormProps) {
	const [showCreateContactModal, setShowCreateContactModal] = useState(false);
	const [manualSet, setManualSet] = useState(false);
	const [manualPos, setManualPos] = useState<Coordinate | "">();
	const [selectedContactId, setSelectedContactId] = useState<number | "">("");
	const [contactList, setContactList] = useState<Contact[]>(contacts);

	return (
		<>
			<Form method="POST" action="/bateaux/nouveau" className="space-y-4">
				{({ errors, processing, reset }) => (
					<>
						<div className="flex flex-col md:flex-row gap-4 items-end">
							<Input
								required
								label="Nom du bateau *"
								placeholder="Ex: Black Pearl"
								name="name"
								error={errors.name}
							/>
							<Select
								name="contact_id"
								label="Attribuer un contact"
								value={selectedContactId}
								onChange={(e) =>
									setSelectedContactId(
										e.target.value ? Number(e.target.value) : "",
									)
								}
								options={contactList.map((c) => ({
									id: c.id,
									label: c.company
										? `${c.fullName} - ${c.company}`
										: c.fullName,
								}))}
							/>

							<Button
								type="button"
								variant="secondary"
								icon={<UserPen size="18" />}
								onClick={() => setShowCreateContactModal(true)}
								className="size-12"
							/>
						</div>
						<div className="flex flex-col md:flex-row gap-4">
							<Select
								name="boat_brand_id"
								label="Constructeur"
								options={boatConstructors.map((b) => ({
									id: b.id,
									label: b.name,
								}))}
							/>
							<Input
								error={errors.model}
								name="model"
								label="Modèle"
								placeholder="Ex: C38"
							/>
							<Select
								name="boat_type_id"
								label="Type"
								options={boatTypes.map((b) => ({
									id: b.id,
									label: b.label,
								}))}
							/>
						</div>
						<div className="space-y-2">
							<div className="space-x-2">
								<input
									onChange={() => setManualSet(!manualSet)}
									checked={manualSet}
									id="manualSet"
									type="checkbox"
								/>
								<label htmlFor="manualSet">Placer le bateau manuellement</label>
							</div>

							{manualSet ? (
								<>
									<input
										type="hidden"
										name="position[0]"
										value={manualPos ? manualPos[0] : ""}
									/>
									<input
										type="hidden"
										name="position[1]"
										value={manualPos ? manualPos[1] : ""}
									/>
									<ManualSetPositionCard
										onChange={(pos) => setManualPos(pos)}
									/>
								</>
							) : (
								<Input
									error={errors.place}
									name="place"
									label="Place"
									placeholder="Ex: 9 ou 604"
								/>
							)}
						</div>
						<Input
							error={errors.mmsi}
							name="mmsi"
							label="N° MMSI"
							placeholder="Ex: 227123456"
						/>
						<Input
							error={errors.call_sign}
							name="call_sign"
							label="Indicatif radio"
							placeholder="Ex: FABC, FQ1234"
						/>
						<div className="flex flex-col md:flex-row gap-4">
							<Input
								error={errors.length}
								name="length"
								label="Longueur (ft)"
								placeholder="Ex: 12,5"
								type="number"
								min="1"
								step="0.5"
							/>
							<Input
								error={errors.beam}
								name="beam"
								label="Largeur (ft)"
								placeholder="Ex: 6"
								type="number"
								min="1"
								step="0.5"
							/>
						</div>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between md:mt-10 gap-4">
							<Button type="submit" disabled={processing}>
								Enregistrer
							</Button>
							<Button
								type="reset"
								onClick={() => reset()}
								icon={<X size="18" />}
								variant="secondary"
							>
								Réinitialiser
							</Button>
						</div>
					</>
				)}
			</Form>
			<CreateContactModal
				open={showCreateContactModal}
				onClose={() => setShowCreateContactModal(false)}
				onCreated={(contact) => {
					setContactList((prev) => [...prev, contact]);
					setSelectedContactId(contact.id);
				}}
			/>
		</>
	);
}
