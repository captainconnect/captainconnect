import { Link } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Intervention } from "#types/intervention";
import IconBadge from "~/components/ui/IconBadge";
import useIntervention from "~/hooks/useIntervention";

type InterventionListItemProps = {
	intervention: Intervention;
};

export default function InterventionListItem({
	intervention,
}: InterventionListItemProps) {
	const { status, createdAt, endAt, progress, totalTasks, doneTasks } =
		useIntervention(intervention);

	return (
		<li>
			<Link
				className="flex flex-col gap-6 bg-white rounded-xl border border-gray-300 p-6 cursor-pointer hover:shadow-sm transition active:scale-[99%] w-full"
				href={`/interventions/${intervention.slug}`}
			>
				<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
					<div className="flex flex-col md:flex-row gap-4">
						<IconBadge icon={<Wrench />} />
						<div>
							<p className="text-lg font-semibold">
								{intervention.boat.name} • {intervention.title}
							</p>
							<p className="text-slate-500">
								{totalTasks
									? `${doneTasks}/${totalTasks} tâches terminées`
									: "Aucune tâche"}
							</p>
							{endAt && (
								<p className="text-slate-500">
									Échéance le {endAt.toLocaleDateString("fr-FR")}
								</p>
							)}
							<p className="text-slate-500">
								Créée le {createdAt.toLocaleDateString("fr-FR")}
							</p>
						</div>
					</div>

					<div className="gap-2 h-full w-full md:w-1/3 flex flex-col justify-center">
						<p className="text-slate-500">Progression : {progress}%</p>
						<div className="w-full bg-gray-200 h-2 rounded-full">
							<div
								className="bg-blue-950 h-full rounded-full transition-all duration-500"
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>

					<div>
						<p
							className={`p-1 px-3 ${status.color} rounded-full text-white font-semibold text-sm text-center`}
						>
							{status.label}
						</p>
					</div>
				</div>
			</Link>
		</li>
	);
}
