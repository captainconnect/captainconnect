import { Link } from "@inertiajs/react";
import type { Intervention } from "#types/intervention";

type BoatInterventionListItemProps = {
	intervention: Intervention;
	index: number;
};

export default function BoatInterventionListItem({
	intervention,
	index,
}: BoatInterventionListItemProps) {
	const createdAt = new Date(intervention.createdAt).toLocaleDateString(
		"fr-FR",
	);

	let status: string = "";
	if (intervention.status === "DONE") {
		status = "Facturée";
	} else if (intervention.status === "SUSPENDED") {
		status = "Suspendue";
	} else if (intervention.status === "IN_PROGRESS") {
		if (intervention.isProgressComplete) {
			status = "Terminée";
		} else {
			status = "En cours";
		}
	}

	return (
		<li className="w-full">
			<Link
				className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 flex md:items-center md:justify-between transition active:scale-[99%] flex-col md:flex-row"
				href={`/interventions/${intervention.slug}`}
			>
				<div className="flex items-center gap-4 flex-col md:flex-row">
					<span className="bg-blue-950 w-8 h-8 text-white flex items-center justify-center rounded-full font-semibold">
						{index + 1}
					</span>
					<div className="flex flex-col">
						<p className="text-black font-semibold">{intervention.title}</p>
						{intervention.description && (
							<p className="text-slate-600 text-sm">
								{intervention.description}
							</p>
						)}
						<p className="text-xs text-slate-500 mt-1">Créée le {createdAt}</p>
					</div>
				</div>
				<p className="p-1 mt-4 md:mt-0 px-3 bg-blue-950 rounded-full text-white font-semibold text-sm text-center">
					{status}
				</p>
			</Link>
		</li>
	);
}
