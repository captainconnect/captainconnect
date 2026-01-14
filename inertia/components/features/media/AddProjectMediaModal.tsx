import { FileUp } from "lucide-react";
import { useRef } from "react";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";
import ProjectMediaForm from "./ProjectMediaForm";

type AddProjectMediaModalProps = BaseModalProps & {
	boatId: number;
	interventionId?: number;
	taskId?: number;
	userId?: number;
};

export default function AddProjectMediaModal({
	open,
	onClose,
	interventionId,
	boatId,
	taskId,
}: AddProjectMediaModalProps) {
	const formRef = useRef<{ resetForm: () => void } | null>(null);

	function handleModalClose() {
		formRef.current?.resetForm();
		onClose();
	}

	return (
		<Modal
			title="Ajouter un fichier"
			subtitle="Image ou document"
			icon={<FileUp size="30" />}
			open={open}
			onClose={handleModalClose}
		>
			<ProjectMediaForm
				ref={formRef}
				onClose={handleModalClose}
				boatId={boatId}
				interventionId={interventionId}
				taskId={taskId}
			/>
		</Modal>
	);
}
