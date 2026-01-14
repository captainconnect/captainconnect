import { Files } from "lucide-react";
import type { FileMedia } from "#types/media";
import DocumentList from "~/components/features/media/DocumentList";
import EmptyList from "~/components/ui/EmptyList";
import type { TabProps } from "~/components/ui/Tab";
import Tab from "~/components/ui/Tab";

type DocumentsTabProps = TabProps & {
	documents: FileMedia[] | null;
	selectedCount: number;
	setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
	isSelected: (key: string) => boolean;
	toggle: (key: string) => void;
	getKey: (doc: FileMedia, index: number) => string;
	handleDocumentClick: (key: string, index: number) => void;
};

export default function DocumentsTab({
	selected,
	documents,
	isSelected,
	selectedCount,
	setSelected,
	toggle,
	getKey,
	handleDocumentClick,
}: DocumentsTabProps) {
	if (!documents) return null;
	return (
		<Tab selected={selected}>
			{documents.length === 0 ? (
				<EmptyList text="Aucun document" icon={<Files size="48" />} />
			) : (
				<DocumentList
					isSelected={isSelected}
					selectedCount={selectedCount}
					setSelected={setSelected}
					toggle={toggle}
					getKey={getKey}
					documents={documents}
					handleDocumentClick={handleDocumentClick}
				/>
			)}
		</Tab>
	);
}
