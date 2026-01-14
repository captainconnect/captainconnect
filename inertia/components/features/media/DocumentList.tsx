import { FileText } from "lucide-react";
import type { FileMedia } from "#types/media";

type DocumentListProps = {
	documents: FileMedia[];
	selectedCount: number;
	setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
	isSelected: (key: string) => boolean;
	toggle: (key: string) => void;
	getKey: (doc: FileMedia, index: number) => string;
	handleDocumentClick: (key: string, index: number) => void;
};

export default function DocumentList({
	documents,
	selectedCount,
	setSelected,
	isSelected,
	toggle,
	getKey,
	handleDocumentClick,
}: DocumentListProps) {
	return (
		<div>
			{selectedCount > 0 && (
				<div className="mb-3 space-x-2 text-sm text-muted-foreground">
					<button
						type="button"
						className="text-blue-500 underline cursor-pointer"
						onClick={() => setSelected(new Set())}
					>
						Désélectionner
					</button>
					<span>
						{selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
					</span>
				</div>
			)}

			<ul className="space-y-2">
				{documents.map((doc, i) => {
					const key = getKey(doc, i);
					const checked = isSelected(key);

					return (
						<li key={key}>
							<button
								type="button"
								onClick={() => handleDocumentClick(key, i)}
								aria-pressed={checked}
								className={`
									cursor-pointer
									group relative flex w-full items-center gap-3
									rounded-xl px-4 py-3 text-left
									bg-muted/10 transition
									hover:bg-muted/20
									focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
									${checked ? "ring-2 ring-ring ring-offset-2" : ""}
								`}
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
										opacity-0 transition-opacity
										group-hover:opacity-100
										checked:opacity-100
										cursor-pointer
									"
								/>

								<FileText className="size-5 text-muted-foreground shrink-0" />

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">
										{doc.caption || "Document"}
									</p>
									{/* {doc.extension && (
										<p className="text-xs text-muted-foreground uppercase">
											.{doc.extension}
										</p>
									)} */}
								</div>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
