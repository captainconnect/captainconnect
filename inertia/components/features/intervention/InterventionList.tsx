import type { Intervention } from "#types/intervention";
import InterventionListItem from "./InterventionListItem";

type InterventionListProps = {
	interventions: Intervention[];
	showPriority: boolean;
};

export default function InterventionList({
	interventions,
	showPriority,
}: InterventionListProps) {
	return (
		<ul className="flex flex-col gap-4">
			{interventions.map((intervention) => (
				<InterventionListItem
					showPriority={showPriority}
					key={intervention.slug}
					intervention={intervention}
				/>
			))}
		</ul>
	);
}
