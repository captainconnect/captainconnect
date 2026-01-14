import { FileUp } from "lucide-react";
import { useRef } from "react";
import type { BaseModalProps } from "~/components/ui/modals/Modal";
import Modal from "~/components/ui/modals/Modal";
import MultipleProjectMediaForm from "./MultipleProjectMediaForm";

type AddMultipleMediaModalProps = BaseModalProps & {
	boatId: number;
};

export default function AddMultipleProjectMediaModal({
	open,
	onClose,
	boatId,
}: AddMultipleMediaModalProps) {
	const formRef = useRef<{ resetForm: () => void } | null>(null);

	function handleModalClose() {
		formRef.current?.resetForm();
		onClose();
	}

	return (
		<Modal
			title="Ajouter des fichiers"
			subtitle="Images ou documents"
			icon={<FileUp size="30" />}
			open={open}
			onClose={handleModalClose}
		>
			<MultipleProjectMediaForm
				ref={formRef}
				onClose={handleModalClose}
				boatId={boatId}
			/>
		</Modal>
	);
}
