import { useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { TaskGroup } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";

type TaskModalProps = BaseModalProps & {
	taskGroups: TaskGroup[];
	interventionSlug: string;
};

export default function TaskModal({
	open,
	onClose,
	taskGroups,
	interventionSlug,
}: TaskModalProps) {
	const [useExistantTaskGroup, setUseExistantTaskGroup] = useState(false);

	const { data, setData, reset, errors, processing, post } = useForm({
		taskGroup: "",
		taskGroupId: "",
		name: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(`/interventions/${interventionSlug}/task`);
		handleOnClose();
	};

	const handleOnClose = () => {
		onClose();
		setTimeout(() => {
			setUseExistantTaskGroup(false);
			reset();
		}, 150);
	};

	return (
		<Modal
			maxWidth="max-w-2xl"
			title="Nouvelle tâche"
			open={open}
			onClose={handleOnClose}
		>
			<div className="space-x-2 text-primary mb-2">
				<input
					id="useExistantGroup"
					type="checkbox"
					checked={useExistantTaskGroup}
					onChange={() => setUseExistantTaskGroup(!useExistantTaskGroup)}
				/>
				<label htmlFor="useExistantGroup">Utiliser un groupe existant</label>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit}>
				{!useExistantTaskGroup && (
					<Input
						label="Nouveau groupe de tâche"
						placeholder="Groupe de tâche"
						value={data.taskGroup}
						onChange={(e) => setData("taskGroup", e.target.value)}
						error={errors.taskGroup}
					/>
				)}
				{useExistantTaskGroup && (
					<Select
						label="Groupe de tâche existant"
						value={data.taskGroupId}
						onChange={(e) => setData("taskGroupId", e.target.value)}
						options={taskGroups.map((tg) => {
							return {
								id: tg.id,
								label: tg.name,
							};
						})}
					/>
				)}
				<Input
					label="Tâche"
					placeholder="Nouvelle tâche"
					value={data.name}
					onChange={(e) => setData("name", e.target.value)}
				/>
				<Button
					processing={processing}
					type="submit"
					disabled={processing}
					icon={<Plus />}
				>
					Ajouter
				</Button>
			</form>
		</Modal>
	);
}
