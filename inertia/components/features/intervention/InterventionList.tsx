import type { Intervention } from "#types/intervention";
import InterventionListItem from "./InterventionListItem";

type InterventionListProps = {
	interventions: Intervention[];
};

export default function InterventionList({
	interventions,
}: InterventionListProps) {
	return (
		<ul className="flex flex-col gap-4">
			{interventions.map((intervention) => (
				<InterventionListItem
					key={intervention.slug}
					intervention={intervention}
				/>
			))}
		</ul>
	);
}
