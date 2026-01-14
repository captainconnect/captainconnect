import { Image } from "lucide-react";
import React from "react";
import type { SlideImage } from "yet-another-react-lightbox";
import type { FileMedia } from "#types/media";
import EmptyList from "~/components/ui/EmptyList";
import type { TabProps } from "~/components/ui/Tab";
import Tab from "~/components/ui/Tab";
import MediaLightbox from "./MediaLightbox";
import PhotoGallery from "./PhotoGallery";

type PhotosTabProps = TabProps & {
	images: FileMedia[] | null;

	setLightboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
	lightboxOpen: boolean;
	lightboxIndex: number;
	setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
	openLightboxAt: (index: number) => void;
	toggle: (key: string) => void;
	isSelected: (key: string) => boolean;
	setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
	selectedCount: number;
	handleImageClick: (key: string, index: number) => void;
	getKey: (img: FileMedia, index: number) => string;
};

export type SlideImageWithMediaId = SlideImage & { projectMediaId: number };
export default function PhotosTab({
	selected,
	images,
	setLightboxOpen,
	lightboxOpen,
	lightboxIndex,
	setLightboxIndex,
	openLightboxAt,
	toggle,
	isSelected,
	setSelected,
	selectedCount,
	handleImageClick,
	getKey,
}: PhotosTabProps) {
	if (!images) return null;
	const lightboxSlides: SlideImageWithMediaId[] = React.useMemo(
		() =>
			images?.map((m) => ({
				projectMediaId: m.id,
				type: "image",
				src: m.url,
				width: m.width,
				height: m.height,
				title: prettyTitle(m),
				description: prettyMeta(m),
				downloadUrl: m.url,
			})),
		[images],
	);

	return (
		<Tab selected={selected}>
			{images.length === 0 ? (
				<EmptyList icon={<Image size="48" />} text="Aucune photo" />
			) : (
				<PhotoGallery
					selectedCount={selectedCount}
					setSelected={setSelected}
					isSelected={isSelected}
					handleImageClick={handleImageClick}
					toggle={toggle}
					getKey={getKey}
					openLightboxAt={openLightboxAt}
					images={images}
				/>
			)}
			<MediaLightbox
				onClose={() => setLightboxOpen(false)}
				open={lightboxOpen}
				images={lightboxSlides}
				index={lightboxIndex}
				setCurrentIndex={setLightboxIndex}
			/>
		</Tab>
	);
}

function formatBytes(bytes: number) {
	if (!Number.isFinite(bytes)) return "";
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	let n = bytes;
	while (n >= 1024 && i < units.length - 1) {
		n /= 1024;
		i++;
	}
	const fixed = n < 10 && i > 0 ? 1 : 0;
	return `${n.toFixed(fixed)} ${units[i]}`;
}

function prettyTitle(m: FileMedia) {
	return (
		m.caption ||
		m.taskName ||
		m.interventionTitle ||
		m.boatName ||
		`Fichier #${m.id}`
	);
}

function prettyMeta(m: FileMedia) {
	const date = new Date(m.createdAt).toLocaleString("fr-FR");
	const bits = [
		m.boatName ? `Bateau: ${m.boatName}` : null,
		m.interventionTitle ? `Interv.: ${m.interventionTitle}` : null,
		m.taskName ? `Tâche: ${m.taskName}` : null,
		m.owner ? `Par: ${m.owner}` : null,
		date ? `Date: ${date}` : null,
		m.size ? `Taille: ${formatBytes(m.size)}` : null,
	].filter(Boolean);
	return bits.join(" • ");
}
