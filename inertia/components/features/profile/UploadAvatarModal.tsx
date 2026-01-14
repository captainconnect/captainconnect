import { ImageUp } from "lucide-react";
import Modal, { type BaseModalProps } from "~/components/ui/modals/Modal";
import UploadAvatarForm from "./UploadAvatarForm";

type UploadAvatarModalProps = BaseModalProps;

export default function UploadAvatarModal({
	open,
	onClose,
}: UploadAvatarModalProps) {
	return (
		<Modal
			title="Avatar"
			subtitle="Mettre à jour l'avatar"
			open={open}
			onClose={onClose}
			icon={<ImageUp size="30" />}
		>
			<UploadAvatarForm onClose={onClose} />
		</Modal>
	);
}
