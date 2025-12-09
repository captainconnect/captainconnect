import type { InformationBlockItemProps } from "./InformationBlockItem";
import InformationBlockItem from "./InformationBlockItem";

type InformationsBlockProps = {
	data: InformationBlockItemProps[];
	display?: "BLOCK" | "GRID";
	showUndefined?: boolean;
};

export default function InformationsBlock({
	data,
	display = "GRID",
	showUndefined = true,
}: InformationsBlockProps) {
	return (
		<div
			className={
				display === "GRID"
					? "grid grid-cols-2 gap-y-4 gap-x-8 mt-4"
					: "space-y-4 mt-4"
			}
		>
			{data.map((i) => {
				if (i.value === null) {
					if (!showUndefined) {
						return null;
					}
				}

				return (
					<InformationBlockItem
						key={`${i.label}-${i.value}`}
						icon={i.icon}
						label={i.label}
						value={i.value}
					/>
				);
			})}
		</div>
	);
}
