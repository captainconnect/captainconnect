import { useForm } from "@inertiajs/react";
import { Pause } from "lucide-react";
import Button from "../ui/buttons/Button";
import Textarea from "../ui/inputs/TextArea";
import Modal, { type BaseModalProps } from "../ui/modals/Modal";

type SuspendModalProps = BaseModalProps & {
	scope: "intervention" | "task";
	interventionSlug: string;
	taskId?: number;
};

export default function SuspendModal({
	open,
	onClose,
	scope,
	interventionSlug,
	taskId,
}: SuspendModalProps) {
	const { data, setData, patch, processing, reset, errors } = useForm({
		reason: "",
	});

	const handleSubmit = () => {
		if (scope === "intervention") {
			patch(`/interventions/${interventionSlug}/suspend`, {
				onSuccess: () => {
					handleOnClose();
				},
			});
		} else {
			patch(`/tasks/${taskId}/suspend`, {
				onSuccess: () => {
					handleOnClose();
				},
			});
		}
	};

	const handleOnClose = () => {
		onClose();
		reset();
	};

	return (
		<Modal
			onClose={onClose}
			open={open}
			title={`Suspendre ${scope === "intervention" ? "l'intervention" : "la tâche"} ?`}
			icon={<Pause size="20" />}
		>
			<Textarea
				value={data.reason}
				onChange={(e) => setData("reason", e.target.value)}
				label="Raison de la suspension"
				placeholder="Raison"
				error={errors.reason}
				required
			/>
			<div className="flex gap-4 mt-2">
				<Button processing={processing} onClick={handleSubmit}>
					Confirmer
				</Button>
				<Button variant="secondary" onClick={handleOnClose}>
					Annuler
				</Button>
			</div>
		</Modal>
	);
}
