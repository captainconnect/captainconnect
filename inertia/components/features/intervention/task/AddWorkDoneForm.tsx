import { useForm, usePage } from "@inertiajs/react";
import { Check, Save, UserPlus, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import type { User } from "#types/user";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Textarea from "~/components/ui/inputs/TextArea";

type TechnicianOption = {
	id: number;
	label: string;
};

type AddWorkDoneFormProps = {
	onClose: () => void;
	users: User[];
	taskId: number;
	interventionSlug: string;
};

export default function AddWorkDoneForm({
	onClose,
	users,
	taskId,
	interventionSlug,
}: AddWorkDoneFormProps) {
	const { props } = usePage<{ authenticatedUser: User }>();
	const currentUser = props.authenticatedUser;

	/* --------------------------------------------
	 * Helpers
	 * ------------------------------------------ */

	const getDefaultDate = () => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
			2,
			"0",
		)}-${String(d.getDate()).padStart(2, "0")}`;
	};

	const allTechnicians: TechnicianOption[] = users
		.filter((u) => u.id !== currentUser.id)
		.map((u) => ({
			id: u.id,
			label: `${u.firstname} ${u.lastname}`,
		}));

	/* --------------------------------------------
	 * useForm (SOURCE DE VÉRITÉ)
	 * ------------------------------------------ */

	const { data, setData, post, processing, errors } = useForm<{
		date: string;
		work_done: string;
		used_materials: string;
		hour_count: number | "";
		technician_ids: number[];
	}>({
		date: getDefaultDate(),
		work_done: "",
		used_materials: "",
		hour_count: "",
		technician_ids: [currentUser.id],
	});

	/* --------------------------------------------
	 * UI State
	 * ------------------------------------------ */

	const [addTechnician, setAddTechnician] = useState(false);

	const [selectedTechnicians, setSelectedTechnicians] = useState<
		TechnicianOption[]
	>([
		{
			id: currentUser.id,
			label: `${currentUser.firstname} ${currentUser.lastname}`,
		},
	]);

	const [addableTechnicians, setAddableTechnicians] =
		useState<TechnicianOption[]>(allTechnicians);

	const [currentSelectTechnician, setCurrentSelectTechnician] =
		useState<TechnicianOption | null>(
			allTechnicians.length ? allTechnicians[0] : null,
		);

	/* --------------------------------------------
	 * Sync select when addable list changes
	 * ------------------------------------------ */

	useEffect(() => {
		setCurrentSelectTechnician(
			addableTechnicians.length ? addableTechnicians[0] : null,
		);
	}, [addableTechnicians]);

	/* --------------------------------------------
	 * Handlers
	 * ------------------------------------------ */

	const handleOnTechnicianSelectChange = (value: string) => {
		const technician = addableTechnicians.find((u) => u.id === Number(value));
		if (!technician) return;
		setCurrentSelectTechnician(technician);
	};

	const handleAddTechnician = () => {
		if (!currentSelectTechnician) return;

		setSelectedTechnicians((prev) => [...prev, currentSelectTechnician]);
		setAddableTechnicians((prev) =>
			prev.filter((u) => u.id !== currentSelectTechnician.id),
		);

		setData("technician_ids", [
			...data.technician_ids,
			currentSelectTechnician.id,
		]);

		setAddTechnician(false);
	};

	const removeTechnician = (id: number) => {
		if (id === currentUser.id) return;

		const removed = selectedTechnicians.find((t) => t.id === id);
		if (!removed) return;

		// UI
		setSelectedTechnicians((prev) => prev.filter((t) => t.id !== id));
		setAddableTechnicians((prev) => [...prev, removed]);

		// FORM DATA
		setData(
			"technician_ids",
			data.technician_ids.filter((tid) => tid !== id),
		);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		post(`/interventions/${interventionSlug}/task/${taskId}/store`, {
			onSuccess: () => {
				setData({
					date: getDefaultDate(),
					work_done: "",
					used_materials: "",
					hour_count: "",
					technician_ids: [currentUser.id],
				});
				onClose();
			},
		});
	};

	/* --------------------------------------------
	 * Render
	 * ------------------------------------------ */

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="space-y-2">
				<span className="text-primary">Techniciens</span>

				<ul className="pl-2 text-primary font-semibold space-y-1 mt-2">
					{selectedTechnicians.map((u) => (
						<li key={u.id} className="flex gap-2 items-center">
							{u.label}
							{u.id !== currentUser.id && (
								<button
									type="button"
									onClick={() => removeTechnician(u.id)}
									className="text-gray-500 active:scale-95 transition"
								>
									<X size={20} />
								</button>
							)}
						</li>
					))}
				</ul>

				{!addTechnician && addableTechnicians.length > 0 && (
					<Button
						type="button"
						icon={<UserPlus size={20} />}
						onClick={() => setAddTechnician(true)}
					>
						Ajouter un technicien
					</Button>
				)}

				{addTechnician && currentSelectTechnician && (
					<div className="space-y-4">
						<Select
							options={addableTechnicians}
							value={currentSelectTechnician.id}
							onChange={(e) => handleOnTechnicianSelectChange(e.target.value)}
							allowNull={false}
						/>

						<div className="flex gap-2">
							<Button
								type="button"
								onClick={handleAddTechnician}
								icon={<Check size={20} />}
							>
								Confirmer
							</Button>
							<Button
								type="button"
								variant="secondary"
								icon={<X size={20} />}
								onClick={() => setAddTechnician(false)}
							>
								Annuler
							</Button>
						</div>
					</div>
				)}
			</div>

			<Input
				label="Date"
				type="date"
				value={data.date}
				onChange={(e) => setData("date", e.target.value)}
				error={errors.date}
				required
			/>

			<Textarea
				label="Travaux effectués"
				value={data.work_done}
				onChange={(e) => setData("work_done", e.target.value)}
				error={errors.work_done}
				placeholder="- Vérification relais"
				required
			/>

			<Textarea
				label="Matériel utilisé"
				value={data.used_materials}
				onChange={(e) => setData("used_materials", e.target.value)}
				error={errors.used_materials}
				placeholder="- 5m Fil rouge 6mm²"
			/>

			<Input
				label="Heures"
				type="number"
				step=".25"
				value={data.hour_count}
				placeholder="Ex: 1,25"
				required
				onChange={(e) =>
					setData(
						"hour_count",
						e.target.value === "" ? "" : Number(e.target.value),
					)
				}
				error={errors.hour_count}
				min={0.25}
			/>

			<div className="flex gap-4">
				<Button type="submit" icon={<Save />} disabled={processing}>
					Sauvegarder
				</Button>
				<Button type="button" variant="secondary" onClick={onClose}>
					Annuler
				</Button>
			</div>
		</form>
	);
}
