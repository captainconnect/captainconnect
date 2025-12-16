import { useForm } from "@inertiajs/react";
import { Save, X } from "lucide-react";
import type { Task, TaskGroup } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";
import Input from "~/components/ui/inputs/Input";
import Select from "~/components/ui/inputs/Select";
import Modal, { type BaseModalProps } from "~/components/ui/modals/Modal";

type UpdateTaskModalProps = BaseModalProps & {
	task: Task;
	taskGroups: TaskGroup[];
	interventionSlug: string;
};

export default function UpdateTaskModal({
	onClose,
	open,
	task,
	taskGroups,
	interventionSlug,
}: UpdateTaskModalProps) {
	const getInitialData = () => {
		return {
			name: task.name,
			taskGroupId: task.taskGroup.id,
		};
	};

	const { data, setData, patch, errors } = useForm(getInitialData());

	const handleTaskGroupOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		const id = Number(value);
		setData("taskGroupId", id);
	};

	const options = taskGroups.map((tg) => {
		return {
			id: tg.id,
			label: tg.name,
		};
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		patch(`/tasks/${interventionSlug}/${task.id}`, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	const handleReset = () => {
		setData(getInitialData());
	};

	return (
		<Modal onClose={onClose} open={open} title="Modifier la tâche">
			<form onSubmit={handleSubmit} onReset={handleReset} className="space-y-4">
				<Select
					allowNull={false}
					label="Groupe de tâche"
					defaultValue={data.taskGroupId}
					onChange={(e) => handleTaskGroupOnChange(e)}
					options={options}
					name="taskGroupId"
				/>
				<Input
					error={errors.name}
					name="name"
					label="Tâche"
					value={data.name}
					onChange={(e) => setData("name", e.target.value)}
				/>
				<div className="flex gap-4">
					<Button type="submit" icon={<Save size="20" />}>
						Sauvegarder
					</Button>
					<Button type="reset" icon={<X size="20" />} variant="secondary">
						Réinitialiser
					</Button>
				</div>
			</form>
		</Modal>
	);
}
