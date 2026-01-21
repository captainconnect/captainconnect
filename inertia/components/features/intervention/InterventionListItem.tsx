import { Link } from "@inertiajs/react";
import type { Intervention } from "#types/intervention";
import { getBoatTypeIcon } from "~/app/utils";
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
				className="flex flex-col gap-6 bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-sm transition active:scale-[99%] w-full"
				href={`/interventions/${intervention.slug}`}
			>
				<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
					<div className="flex flex-col md:w-3/10 md:flex-row gap-4">
						{intervention.boat.thumbnailUrl ? (
							<img
								className="rounded-xl size-18"
								src={intervention.boat.thumbnailUrl}
								alt="Miniature du bateau"
							/>
						) : (
							<IconBadge
								size="18"
								icon={getBoatTypeIcon(intervention.boat.type?.label)}
							/>
						)}
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

					<div className="gap-2 h-full w-full md:w-4/10 flex flex-col justify-center">
						<p className="text-slate-500">Progression : {progress}%</p>
						<div className="w-full bg-gray-200 h-2 rounded-full">
							<div
								className="bg-blue-950 h-full rounded-full transition-all duration-500"
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>

					<div className="md:w-1/10">
						<p
							className={`p-1 px-3 ${status.color} rounded-full text-white font-semibold text-sm text-center`}
						>
							{status.label}
						</p>
						{intervention.suspensionReason && (
							<p className="mt-2">{intervention.suspensionReason}</p>
						)}
					</div>
				</div>
			</Link>
		</li>
	);
}
