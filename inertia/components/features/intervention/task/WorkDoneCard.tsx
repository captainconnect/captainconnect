import { router } from "@inertiajs/react";
import { Clock, ToolCase, Trash, Wrench } from "lucide-react";
import type { FormattedWorkDone } from "#types/workdone";
import Button from "~/components/ui/buttons/Button";
import Section from "~/components/ui/Section";
import AdminChecker from "../../AdminChecker";

type WorkDoneCardProps = {
	workDone: FormattedWorkDone;
	onUpdate: (workdone: FormattedWorkDone) => void;
	taskId: number;
};

export default function WorkDoneCard({
	workDone,
	onUpdate,
	taskId,
}: WorkDoneCardProps) {
	const handleDelete = () => {
		const confirmation = confirm(
			"Supprimer le travail effectué ? Les heures seront perdues",
		);
		if (!confirmation) return;
		router.delete(`/interventions/task/${taskId}/workdone/${workDone.id}`);
	};

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
			<AdminChecker mustBeAdmin={true}>
				<div className="flex gap-2">
					<Button onClick={() => onUpdate(workDone)}>Modifier</Button>
					<Button variant="danger" icon={<Trash />} onClick={handleDelete} />
				</div>
			</AdminChecker>
		</Section>
	);
}
