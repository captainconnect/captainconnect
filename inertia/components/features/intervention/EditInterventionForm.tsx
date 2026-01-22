import { useForm } from "@inertiajs/react";
import { Wrench, X } from "lucide-react";
import type { Intervention, InterventionPriority } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Textarea from "~/components/ui/inputs/TextArea";
import { priorityOptions } from "./CreateInterventionForm";

type EditInterventionFormProps = {
	intervention: Intervention;
};

type EditInterventionFormData = {
	title: string;
	description: string | "";
	startAt: string | "";
	endAt: string | "";
	priority: InterventionPriority;
};

export default function EditInterventionForm({
	intervention,
}: EditInterventionFormProps) {
	const formatDateInput = (value: string | Date | null | undefined) => {
		if (!value) return "";
		const iso = value instanceof Date ? value.toISOString() : value;
		return iso.slice(0, 10);
	};

	const getInitialData = (): EditInterventionFormData => ({
		title: intervention.title,
		description: intervention.description ?? "",
		startAt: formatDateInput(intervention.startAt),
		endAt: formatDateInput(intervention.endAt),
		priority: intervention.priority,
	});

	const { put, errors, data, setData, processing } =
		useForm<EditInterventionFormData>(getInitialData());

	const handleReset = () => setData(getInitialData());

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		put(`/interventions/${intervention.slug}/modifier`);
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
					value={data.description ?? ""}
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
			<div className="flex flex-col md:flex-row md:items-center md:justify-between md:mt-10 gap-4">
				<Button type="submit" disabled={processing} icon={<Wrench />}>
					Enregistrer l'intervention
				</Button>
				<Button
					type="button"
					onClick={handleReset}
					icon={<X size="18" />}
					variant="secondary"
				>
					Réinitialiser
				</Button>
			</div>
		</form>
	);
}
