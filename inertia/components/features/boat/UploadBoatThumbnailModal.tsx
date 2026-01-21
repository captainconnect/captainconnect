import { ImageUp } from "lucide-react";
import { useEffect, useRef } from "react";
import Modal, { type BaseModalProps } from "~/components/ui/modals/Modal";
import UploadBoatThumbnailForm from "./UploadBoatThumbnailForm";

type UploadBoatThumbnailModalProps = BaseModalProps & {
	boatId: number;
	hasThumbnail: boolean;
};

export default function UploadBoatThumbnailModal({
	open,
	onClose,
	boatId,
	hasThumbnail,
}: UploadBoatThumbnailModalProps) {
	const formRef = useRef<{ resetForm: () => void }>(null);

	useEffect(() => {
		if (!open) {
			formRef.current?.resetForm();
		}
	}, [open]);

	return (
		<Modal
			title="Miniature du bateau"
			subtitle="Mettre à jour la miniature du bateau"
			open={open}
			onClose={onClose}
			icon={<ImageUp size="30" />}
		>
			<UploadBoatThumbnailForm
				ref={formRef}
				boatId={boatId}
				onClose={onClose}
				hasThumbnail={hasThumbnail}
			/>
		</Modal>
	);
}
