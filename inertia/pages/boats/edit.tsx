import { Head, useForm } from "@inertiajs/react";
import { Ship, UserPen, X } from "lucide-react";
import { useState } from "react";
import type { Boat, BoatConstructor, BoatType, Coordinate } from "#types/boat";
import type { Contact } from "#types/contact";
import ManualSetPositionCard from "~/components/features/boat/ManualSetPositionCard";
import CreateContactModal from "~/components/features/contact/modals/CreateContactModal";
import AppLayout from "~/components/layout/AppLayout";
import Button from "~/components/ui/buttons/Button";
import CardHeader from "~/components/ui/CardHeader";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Textarea from "~/components/ui/inputs/TextArea";

type EditPageProps = {
	boat: Boat;
	contacts: Contact[];
	boatTypes: BoatType[];
	boatConstructors: BoatConstructor[];
};

const EditBoatPage = ({
	boat,
	contacts,
	boatTypes,
	boatConstructors,
}: EditPageProps) => {
	const [manualSet, setManualSet] = useState(!!boat.position);

	const [showCreateContactModal, setShowCreateContactModal] = useState(false);

	const [contactList, setContactList] = useState<Contact[]>(contacts);

	const currentPos = boat.position
		? ([boat.position[0], boat.position[1]] as Coordinate)
		: undefined;

	const getInitialData = () => ({
		name: boat.name,
		contact_id: boat.contact?.id || "",
		boat_constructor_id: boat.boatConstructor?.id || "",
		boat_type_id: boat.type?.id || "",
		model: boat.model || "",
		mmsi: boat.mmsi || "",
		call_sign: boat.callSign || "",
		length: boat.length || "",
		beam: boat.beam || "",
		note: boat.note || "",
		place: boat.place || "",
		position: currentPos || undefined,
	});

	const { put, errors, data, setData, processing } = useForm(getInitialData());

	const handleReset = () => setData(getInitialData());

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(`/bateaux/${boat.slug}`);
	};

	const [selectedContactId, setSelectedContactId] = useState<number | "">(
		data.contact_id as number,
	);

	return (
		<>
			<Head title={`Modifier - ${boat.name}`} />
			<section className="bg-white space-y-4 w-full rounded-xl p-6 border border-gray-200">
				<CardHeader
					back={`/bateaux/${boat.slug}`}
					icon={<Ship />}
					title="Informations du bateau"
					subtitle="Complétez les informations du bateau"
				/>
				<form onSubmit={submit} className="space-y-4">
					<div className="flex flex-col md:flex-row gap-4 items-end">
						<Input
							required
							label="Nom du bateau *"
							placeholder="Ex: Black Pearl"
							name="name"
							value={data.name}
							error={errors.name}
							onChange={(e) => setData("name", e.target.value)}
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
								label: c.company ? `${c.fullName} - ${c.company}` : c.fullName,
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
							name="boat_constructor_id"
							label="Constructeur"
							value={data.boat_constructor_id}
							options={boatConstructors.map((b) => ({
								id: b.id,
								label: b.name,
							}))}
							onChange={(e) => setData("boat_constructor_id", e.target.value)}
						/>
						<Input
							error={errors.model}
							value={data.model}
							name="model"
							label="Modèle"
							placeholder="Ex: C38"
							onChange={(e) => setData("model", e.target.value)}
						/>
						<Select
							name="boat_type_id"
							label="Type"
							value={data.boat_type_id}
							options={boatTypes.map((b) => ({
								id: b.id,
								label: b.label,
							}))}
							onChange={(e) => setData("boat_type_id", e.target.value)}
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
							<label htmlFor="manualSet">
								Modifier la position du bateau manuellement
							</label>
						</div>
						{manualSet ? (
							<>
								<input
									type="hidden"
									name="position[0]"
									value={data.position ? data.position[0] : ""}
								/>
								<input
									type="hidden"
									name="position[1]"
									value={data.position ? data.position[1] : ""}
								/>
								<ManualSetPositionCard
									currentPos={currentPos}
									onChange={(pos) => {
										if (Array.isArray(pos) && pos.length === 2) {
											setData("position", pos);
										} else {
											setData("position", undefined);
										}
									}}
								/>
							</>
						) : (
							<Input
								error={errors.place}
								name="place"
								label="Place"
								placeholder="Ex: 9 ou 604"
								value={data.place}
								onChange={(e) => setData("place", e.target.value)}
							/>
						)}
					</div>
					<Input
						error={errors.mmsi}
						name="mmsi"
						label="N° MMSI"
						value={data.mmsi}
						placeholder="Ex: 227123456"
						onChange={(e) => setData("mmsi", e.target.value)}
					/>
					<Input
						error={errors.call_sign}
						value={data.call_sign}
						name="call_sign"
						label="Indicatif radio"
						placeholder="Ex: FABC, FQ1234"
						onChange={(e) => setData("call_sign", e.target.value)}
					/>
					<div className="flex flex-col md:flex-row gap-4">
						<Input
							error={errors.length}
							value={data.length}
							name="length"
							label="Longueur (ft)"
							placeholder="Ex: 12,5"
							type="number"
							min="1"
							step="0.5"
							onChange={(e) => setData("length", e.target.value)}
						/>
						<Input
							error={errors.beam}
							value={data.beam}
							name="beam"
							label="Largeur (ft)"
							placeholder="Ex: 6"
							type="number"
							min="1"
							step="0.5"
							onChange={(e) => setData("beam", e.target.value)}
						/>
					</div>
					<Textarea
						error={errors.note}
						value={data.note}
						onChange={(e) => setData("note", e.target.value)}
						name="note"
						label="Notes"
						placeholder="Rédiger des notes sur le bateau"
					/>
					<div className="flex items-center justify-between mt-10">
						<Button processing={processing} type="submit" disabled={processing}>
							Enregistrer
						</Button>
						<Button
							type="button"
							onClick={handleReset}
							icon={<X size="18" />}
							variant="secondary"
							disabled={processing}
						>
							Réinitialiser
						</Button>
					</div>
				</form>
			</section>
			<CreateContactModal
				open={showCreateContactModal}
				onClose={() => setShowCreateContactModal(false)}
				onCreated={(contact) => {
					setContactList((prev) => [...prev, contact]);
					setSelectedContactId(contact.id);
					setData("contact_id", contact.id);
				}}
			/>
		</>
	);
};

EditBoatPage.layout = (page: React.ReactNode & { props: EditPageProps }) => {
	const { boat } = page.props;
	return <AppLayout title={`Modifier - ${boat.name}`}>{page}</AppLayout>;
};

export default EditBoatPage;
