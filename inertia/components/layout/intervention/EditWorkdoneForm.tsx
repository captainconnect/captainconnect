import { useForm } from "@inertiajs/react";
import { Check, Save, UserPlus, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { User } from "#types/user";
import type { FormattedWorkDone } from "#types/workdone";
import { frDateToInputDate } from "~/app/utils";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Textarea from "~/components/ui/inputs/TextArea";

type TechnicianOption = {
	id: number;
	label: string;
};

type EditWorkDoneFormProps = {
	users: User[];
	workDone: FormattedWorkDone;
	onClose: () => void;
};

export default function EditWorkDoneForm({
	users,
	workDone,
	onClose,
}: EditWorkDoneFormProps) {
	const allTechnicians: TechnicianOption[] = users.map((u) => ({
		id: u.id,
		label: `${u.firstname} ${u.lastname}`,
	}));

	const [selectedTechnicians, setSelectedTechnicians] = useState<
		TechnicianOption[]
	>(allTechnicians.filter((t) => workDone.technician_ids.includes(t.id)));
	const { data, setData, put, processing, errors } = useForm<{
		date: string;
		work_done: string;
		used_materials: string | null | undefined;
		hour_count: number | "";
		technician_ids: number[];
	}>({
		date: frDateToInputDate(workDone.date),
		work_done: workDone.workDone,
		used_materials: workDone.usedMaterials,
		hour_count: workDone.hour_count,
		technician_ids: workDone.technician_ids,
	});

	const [addableTechnicians, setAddableTechnicians] = useState<
		TechnicianOption[]
	>(allTechnicians.filter((t) => !workDone.technician_ids.includes(t.id)));

	const [addTechnician, setAddTechnician] = useState(false);
	const [currentSelectTechnician, setCurrentSelectTechnician] =
		useState<TechnicianOption | null>(
			allTechnicians.length ? addableTechnicians[0] : null,
		);

	const handleOnTechnicianSelectChange = (value: string) => {
		const technician = addableTechnicians.find((u) => u.id === Number(value));
		if (!technician) return;
		setCurrentSelectTechnician(technician);
	};

	const handleAddTechnician = () => {
		if (!currentSelectTechnician) return;

		const addedId = currentSelectTechnician.id;

		// calcule la nouvelle liste addable (sans celui qu'on ajoute)
		const nextAddable = addableTechnicians.filter((u) => u.id !== addedId);

		// UI
		setSelectedTechnicians((prev) => [...prev, currentSelectTechnician]);
		setAddableTechnicians(nextAddable);

		// FORM DATA (sans doublon)
		const nextTechnicianIds = Array.from(
			new Set([...data.technician_ids, addedId]),
		);
		setData("technician_ids", nextTechnicianIds);

		// next current
		setCurrentSelectTechnician(nextAddable.length ? nextAddable[0] : null);

		setAddTechnician(false);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		put(`/interventions/work-done/${workDone.id}`, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	const removeTechnician = (id: number) => {
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

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div className="flex justify-between items-center">
				<div className="space-y-2">
					<span className="text-primary">Techniciens</span>

					<ul className="pl-2 text-primary font-semibold space-y-1 mt-2">
						{selectedTechnicians.map((u) => (
							<li key={u.id} className="flex gap-2 items-center">
								{u.label}
								{selectedTechnicians.length > 1 && (
									<button
										type="button"
										onClick={() => removeTechnician(u.id)}
										className="text-gray-500 active:scale-95 transition"
										title="Retirer"
									>
										<X size={20} />
									</button>
								)}
							</li>
						))}
					</ul>

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

				{!addTechnician && addableTechnicians.length > 0 && (
					<Button
						type="button"
						icon={<UserPlus size={20} />}
						onClick={() => {
							setAddTechnician(true);
							setCurrentSelectTechnician(addableTechnicians[0] ?? null);
						}}
					>
						Ajouter un technicien
					</Button>
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
				placeholder="Travaux effectués"
				required
			/>

			<Textarea
				label="Matériel utilisé"
				value={data.used_materials as string}
				onChange={(e) => setData("used_materials", e.target.value)}
				error={errors.used_materials}
				placeholder="Matériel utilisé"
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
					Enregistrer les modifications
				</Button>
				{/* <Button type="button" variant="secondary" onClick={onClose}>
					Annuler
				</Button> */}
			</div>
		</form>
	);
}
