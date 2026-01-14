import { Video } from "lucide-react";
import type { FileMedia } from "#types/media";

type PhotoGalleryProps = {
	images: FileMedia[];
	openLightboxAt: (index: number) => void;
	selectedCount: number;
	setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
	isSelected: (key: string) => boolean;
	handleImageClick: (key: string, index: number) => void;
	toggle: (key: string) => void;
	getKey: (img: FileMedia, index: number) => string;
};

export default function PhotoGallery({
	images,
	selectedCount,
	setSelected,
	isSelected,
	handleImageClick,
	toggle,
	getKey,
}: PhotoGalleryProps) {
	return (
		<div>
			{selectedCount > 0 && (
				<div className="mb-3 space-x-2 text-sm text-muted-foreground">
					<button
						className="text-blue-500 underline cursor-pointer"
						type="button"
						onClick={() => setSelected(new Set())}
					>
						Désélectionner
					</button>
					<span>
						{selectedCount} sélectionnée{selectedCount > 1 ? "s" : ""}
					</span>
				</div>
			)}

			<div
				className="
					w-full
					columns-1
					sm:columns-2
					md:columns-4
					lg:columns-6
					gap-4
				"
			>
				{images.map((img, i) => {
					const key = getKey(img, i);
					const checked = isSelected(key);

					return (
						<button
							key={key}
							type="button"
							onClick={() => handleImageClick(key, i)}
							className={`
								group relative mb-4 w-full
								break-inside-avoid overflow-hidden rounded-2xl
								bg-muted/10 outline-none shadow-sm transition
								hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
								${checked ? "ring-2 ring-ring ring-offset-2" : ""}
							`}
							aria-pressed={checked}
						>
							<input
								type="checkbox"
								checked={checked}
								onChange={(e) => {
									e.stopPropagation();
									toggle(key);
								}}
								onClick={(e) => e.stopPropagation()}
								className="
									size-5
									absolute left-3 top-3 z-20
									opacity-0 transition-opacity
									group-hover:opacity-100
									checked:opacity-100
									cursor-pointer
								"
							/>

							<div
								className={`
									pointer-events-none absolute inset-0 z-10
									bg-linear-to-t from-black/55 via-black/10 to-transparent
									transition-opacity
									${checked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
								`}
							/>

							{img.type === "image" ? (
								<img
									src={img.url}
									alt={img.caption || "Media"}
									loading="lazy"
									className="block w-full transition-transform duration-300 group-hover:scale-[1.02]"
								/>
							) : (
								<div className="relative aspect-video w-full bg-blue-950">
									<div className="absolute inset-0 flex items-center justify-center">
										<Video size={44} className="text-white" />
									</div>
								</div>
							)}

							{img.caption && (
								<div
									className={`
										absolute bottom-0 left-0 right-0 z-20 p-3 transition-opacity
										${checked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
									`}
								>
									<p className="truncate text-xs font-medium text-white">
										{img.caption}
									</p>
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
