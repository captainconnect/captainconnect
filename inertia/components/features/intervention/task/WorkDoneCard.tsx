import { Clock, ToolCase, Wrench } from "lucide-react";
import type { FormattedWorkDone } from "#types/workdone";
import Section from "~/components/ui/Section";

type WorkDoneCardProps = {
	workDone: FormattedWorkDone;
};

export default function WorkDoneCard({ workDone }: WorkDoneCardProps) {
	return (
		<Section
			title={`Travaux effectués le ${workDone.date}`}
			subtitle={`Par ${workDone.technicians}`}
			icon={<Wrench />}
		>
			<div className="flex p-4 gap-20">
				<div>
					<p className="text-slate-400 flex items-center gap-1">
						<Wrench size="20" />
						Travaux effectués
					</p>
					<p className="font-medium">{workDone.workDone}</p>
				</div>
			</div>
			<div className="flex p-4 gap-20">
				<div>
					<p className="text-slate-400 flex items-center gap-1">
						<ToolCase size="20" />
						Materiel utilisé
					</p>
					<p className="font-medium">
						{workDone.usedMaterials || "Aucun materiel utilisé"}
					</p>
				</div>
			</div>
			<div className="flex p-4 gap-20">
				<div>
					<p className="text-slate-400 flex items-center gap-1">
						<Clock size="20" />
						Heures
					</p>
					<p className="font-medium">{workDone.hour_count}h</p>
				</div>
			</div>
		</Section>
	);
}
