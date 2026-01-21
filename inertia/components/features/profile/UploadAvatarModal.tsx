import { ImageUp } from "lucide-react";
import { useEffect, useRef } from "react";
import Modal, { type BaseModalProps } from "~/components/ui/modals/Modal";
import UploadAvatarForm from "./UploadAvatarForm";

type UploadAvatarModalProps = BaseModalProps;

export default function UploadAvatarModal({
	open,
	onClose,
}: UploadAvatarModalProps) {
	const formRef = useRef<{ resetForm: () => void }>(null);

	useEffect(() => {
		if (!open) {
			formRef.current?.resetForm();
		}
	}, [open]);

	return (
		<Modal
			title="Avatar"
			subtitle="Mettre à jour l'avatar"
			open={open}
			onClose={onClose}
			icon={<ImageUp size="30" />}
		>
			<UploadAvatarForm ref={formRef} onClose={onClose} />
		</Modal>
	);
}
