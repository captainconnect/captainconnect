// FileGallery.tsx
import React, { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

import type { SimplePaginatorMetaKeys } from "@adonisjs/lucid/types/querybuilder";
import { router } from "@inertiajs/react";
import type { Boat } from "#types/boat";
import type { FileMedia, InterventionsFilterData } from "#types/media";
import TabSelector from "~/components/ui/TabSelector";
import useMedia from "~/hooks/useMedia";
import DocumentsTab from "./DocumentsTab";
import PhotosTab from "./PhotosTab";
import Toolbar from "./Toolbar";

type Props = {
	medias: FileMedia[];
	boat: Boat;
	meta: SimplePaginatorMetaKeys;
	interventions?: InterventionsFilterData[];
};

enum Tabs {
	Photos,
	Documents,
}

// ---------- MAIN ----------
export default function FileGallery({
	medias,
	boat,
	meta,
	interventions,
}: Props) {
	const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.Photos);

	const { images, documents } = useMedia({ medias });

	const [lightboxOpen, setLightboxOpen] = React.useState(false);
	const [lightboxIndex, setLightboxIndex] = React.useState(0);

	const openLightboxAt = (index: number) => {
		setLightboxIndex(index);
		setLightboxOpen(true);
	};

	const getKey = (img: FileMedia, index: number) =>
		(img.id as unknown as string) ??
		img.url ??
		`${img.caption ?? "media"}-${index}`;

	const [selected, setSelected] = useState<Set<string>>(() => new Set());

	const toggle = (key: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	};

	const hasSelection = selected.size > 0;
	const selectedCount = selected.size;

	const handleImageClick = (key: string, index: number) => {
		if (hasSelection) toggle(key);
		else openLightboxAt(index);
	};

	const handleDocumentClick = (key: string, index: number) => {
		if (hasSelection) {
			toggle(key);
			return;
		}

		const doc = documents[index];

		if (!doc?.url) return;

		window.open(doc.url, "_blank", "noopener,noreferrer");
	};

	const isSelected = (key: string) => selected.has(key);

	const resetFilters = () => {
		const url = new URL(window.location.href);

		url.searchParams.delete("intervention_id");
		url.searchParams.delete("task_id");
		url.searchParams.delete("page");

		router.get(
			window.location.pathname,
			Object.fromEntries(url.searchParams.entries()),
			{
				preserveScroll: true,
				preserveState: true,
				replace: true,
				only: ["medias", "meta"], // ajoute "interventions" si nécessaire
			},
		);
	};

	return (
		<div className="w-full space-y-4">
			<div className="flex bg-gray-100 rounded-xl mb-5 w-full p-1">
				<TabSelector
					scope="PHOTOS"
					label="Images"
					isSelected={selectedTab === Tabs.Photos}
					setSelectedTab={() => {
						resetFilters();
						setSelected(new Set());
						setSelectedTab(Tabs.Photos);
					}}
				/>
				<TabSelector
					scope="DOCUMENTS"
					label="Documents"
					isSelected={selectedTab === Tabs.Documents}
					setSelectedTab={() => {
						resetFilters();
						setSelected(new Set());
						setSelectedTab(Tabs.Documents);
					}}
				/>
			</div>
			<Toolbar
				interventions={interventions}
				meta={meta}
				boatId={boat.id}
				setSelected={setSelected}
				selected={selected}
				selectedCount={selectedCount}
				resetFilters={resetFilters}
			/>
			<PhotosTab
				setLightboxIndex={setLightboxIndex}
				setLightboxOpen={setLightboxOpen}
				lightboxIndex={lightboxIndex}
				lightboxOpen={lightboxOpen}
				openLightboxAt={openLightboxAt}
				images={images}
				selected={selectedTab === Tabs.Photos}
				selectedCount={selectedCount}
				isSelected={isSelected}
				setSelected={setSelected}
				handleImageClick={handleImageClick}
				toggle={toggle}
				getKey={getKey}
			/>
			<DocumentsTab
				documents={documents}
				selected={selectedTab === Tabs.Documents}
				isSelected={isSelected}
				setSelected={setSelected}
				toggle={toggle}
				getKey={getKey}
				selectedCount={selectedCount}
				handleDocumentClick={handleDocumentClick}
			/>
		</div>
	);
}
