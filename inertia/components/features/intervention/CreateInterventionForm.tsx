import { useForm } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Boat } from "#types/boat";
import type { InterventionPriority } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Textarea from "~/components/ui/inputs/TextArea";
import AddTaskBoard from "./AddTaskBoard";

type CreateInterventionFormProps = {
	boat: Boat;
};

export const priorityOptions = [
	{
		id: "LOW",
		label: "Basse",
	},
	{
		id: "NORMAL",
		label: "Normale",
	},
	{
		id: "HIGH",
		label: "Haute",
	},
	{
		id: "EXTREME",
		label: "Très haute",
	},
];

export default function CreateInterventionForm({
	boat,
}: CreateInterventionFormProps) {
	const { data, setData, errors, processing, post } = useForm({
		title: "",
		description: "",
		startAt: "",
		endAt: "",
		priority: "NORMAL",
		taskGroups: [],
	});

	const hasTaskGroupsError = Object.keys(errors).some((key) =>
		key.startsWith("taskGroups"),
	);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (data.taskGroups.length === 0) return;
		post(`/interventions/nouvelle/${boat.slug}`);
	};

	return (
		<form onSubmit={submit} className="space-y-4">
			<div className="flex flex-col gap-4">
				<Input
					label="Titre de l'intervention *"
					required
					placeholder="Ex: Remplacement du parc batterie"
					name="title"
					type="text"
					value={data.title}
					onChange={(e) => setData("title", e.target.value)}
					error={errors.title}
				/>
				<Textarea
					label="Description (optionnel)"
					name="description"
					value={data.description}
					onChange={(e) => setData("description", e.target.value)}
					error={errors.description}
					placeholder="Description de l'intervention"
				/>
				<div className="flex gap-4">
					<Input
						label="Date de début"
						name="startAt"
						type="date"
						value={data.startAt}
						onChange={(e) => setData("startAt", e.target.value)}
						error={errors.startAt}
					/>
					<Input
						label="Échéance"
						name="endAt"
						type="date"
						value={data.endAt}
						onChange={(e) => setData("endAt", e.target.value)}
						error={errors.endAt}
					/>
					<Select
						options={priorityOptions}
						label="Priorité"
						name="priority"
						allowNull={false}
						onChange={(e) =>
							setData("priority", e.target.value as InterventionPriority)
						}
						value={data.priority}
					/>
				</div>
			</div>
			<hr className="text-gray-200 my-6" />
			<AddTaskBoard
				error={
					hasTaskGroupsError ? "Au moins une tâche est requise" : undefined
				}
				data={data}
				setData={setData}
			/>
			<Button type="submit" disabled={processing} icon={<Wrench />}>
				Enregistrer l'intervention
			</Button>
		</form>
	);
}
