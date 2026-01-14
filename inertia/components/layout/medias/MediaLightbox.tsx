import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { router } from "@inertiajs/react";
import { Trash } from "lucide-react";
import React from "react";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import type { SlideImageWithMediaId } from "./PhotosTab";

type MediaLightboxProps = {
	open: boolean;
	onClose: () => void;
	images: SlideImageWithMediaId[];
	index?: number;
	setCurrentIndex: (index: number) => void;
};

export default function MediaLightbox({
	open,
	onClose,
	images,
	index = 0,
	setCurrentIndex,
}: MediaLightboxProps) {
	const zoomRef = React.useRef(null);
	const zoomConfig = React.useMemo(() => ({ ref: zoomRef }), []);

	const deleteImage = (projectMediaId?: number) => {
		if (!projectMediaId) return;
		if (!confirm("Supprimer l'image ?")) return;

		router.delete(`/media/${projectMediaId}`, {
			preserveScroll: true,
			preserveState: true,
		});
	};

	return (
		<Lightbox
			open={open}
			close={onClose}
			slides={images}
			index={index}
			on={{ view: ({ index: nextIndex }) => setCurrentIndex(nextIndex) }}
			plugins={[Zoom, Download, Captions, Video]}
			zoom={zoomConfig}
			toolbar={{
				buttons: [
					<button
						key="delete-media"
						type="button"
						title="Supprimer"
						className="cursor-pointer yarl_button text-white outline-none"
						onClick={() => deleteImage(images[index]?.projectMediaId)}
					>
						<Trash className="yarl_icon" />
					</button>,
					"close",
				],
			}}
		/>
	);
}
