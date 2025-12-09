import type { Intervention } from "#types/intervention";
import BoatInterventionListItem from "./BoatInterventionListItem";

type BoatInterventionListProps = {
	interventions: Intervention[];
};

export default function BoatInterventionList({
	interventions,
}: BoatInterventionListProps) {
	return (
		<ul className="bg-white flex flex-col items-center justify-center gap-4 text-slate-500 md:p-6">
			{interventions.map((intervention, index) => {
				return (
					<BoatInterventionListItem
						key={intervention.slug}
						intervention={intervention}
						index={index}
					/>
				);
			})}
		</ul>
	);
}
