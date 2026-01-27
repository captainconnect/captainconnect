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

type AddTaskForm = {
	taskGroup?: string;
	taskGroupId?: number;
	name: string;
};

export default function TaskModal({
	open,
	onClose,
	taskGroups,
	interventionSlug,
}: TaskModalProps) {
	const options = taskGroups.map((tg) => {
		return {
			id: tg.id,
			label: tg.name,
		};
	});
	const [useExistantTaskGroup, setUseExistantTaskGroup] = useState(true);
	const [fakeTaskGroupId, setFakeTaskGroupId] = useState<number | string>(
		options[0].id,
	);

	const getInitialData = () => {
		return {
			taskGroupId: options[0].id,
			name: "",
		};
	};

	const { data, setData, reset, errors, processing, post } =
		useForm<AddTaskForm>(getInitialData());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post(`/interventions/${interventionSlug}/task`, {
			onSuccess: () => {
				setData(getInitialData());
				handleOnClose();
			},
			onError: (error) => console.error(error),
		});
	};

	const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;

		if (value === "new") {
			setUseExistantTaskGroup(false);
			setFakeTaskGroupId("new");

			setData("taskGroupId", undefined);
			setData("taskGroup", "");
			return;
		}

		const id = Number(value);

		if (Number.isNaN(id)) return;

		setUseExistantTaskGroup(true);
		setFakeTaskGroupId(value);

		setData("taskGroupId", id);
		setData("taskGroup", undefined);
	};

	const handleOnClose = () => {
		onClose();
		setTimeout(() => {
			setUseExistantTaskGroup(true);
			setFakeTaskGroupId(options[0].id);
			setData(getInitialData());
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
			<form className="space-y-4" onSubmit={handleSubmit}>
				<Select
					label="Groupe de tâche"
					value={fakeTaskGroupId}
					onChange={(e) => handleSelectOnChange(e)}
					allowNull={false}
					options={[...options, { id: "new", label: "Nouveau groupe" }]}
				/>
				{!useExistantTaskGroup && (
					<Input
						label="Nouveau groupe de tâche"
						placeholder="Groupe de tâche"
						value={data.taskGroup}
						onChange={(e) => setData("taskGroup", e.target.value)}
						error={errors.taskGroup}
					/>
				)}

				<Input
					label="Tâche"
					placeholder="Nouvelle tâche"
					value={data.name}
					error={errors.name}
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
