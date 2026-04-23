import type { Intervention } from "#types/intervention";
import InterventionListItem from "./InterventionListItem";

type InterventionListProps = {
	interventions: Intervention[];
};

function getSortOrder(intervention: Intervention): number {
	if (intervention.status === "SUSPENDED") return 2;
	const allTasks =
		intervention.taskGroups?.flatMap((g) => g.tasks) ?? [];
	const total = allTasks.length;
	const done = allTasks.filter((t) => t.status === "DONE").length;
	const progress = total > 0 ? Math.round((done / total) * 100) : 0;
	if (intervention.status === "IN_PROGRESS" && progress === 100) return 1;
	return 0;
}

export default function InterventionList({
	interventions,
}: InterventionListProps) {
	const sorted = [...interventions].sort(
		(a, b) => getSortOrder(a) - getSortOrder(b),
	);

	return (
		<ul className="flex flex-col gap-4">
			{sorted.map((intervention) => (
				<InterventionListItem
					key={intervention.slug}
					intervention={intervention}
				/>
			))}
		</ul>
	);
}
