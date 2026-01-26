import { Link, router } from "@inertiajs/react";
import { Clock, ToolCase, Trash, Wrench } from "lucide-react";
import type { FormattedWorkDone } from "#types/workdone";
import Button from "~/components/ui/buttons/Button";
import IconBadge from "~/components/ui/IconBadge";
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
		<section className="bg-white border border-gray-200 rounded-2xl p-6 ">
			<div className="flex flex-col md:flex-row md:items-center justify-between">
				<div className="flex gap-4 mb-4">
					<IconBadge icon={<Wrench />} />
					<div className="justify-center flex flex-col">
						<p className="text-lg font-semibold">{`Travaux effectués le ${workDone.date}`}</p>

						<div className="hidden md:flex gap-2 text-slate-500">
							<span>Par</span>

							{workDone.technicians.map((tech, index) => {
								const isLast = index === workDone.technicians.length - 1;
								const isBeforeLast = index === workDone.technicians.length - 2;

								return (
									<span key={tech.id} className="inline-flex items-center">
										<Link href={`/utilisateurs/${tech.id}`}>
											<span className="flex items-center gap-1">
												{tech.avatar ? (
													<img
														src={tech.avatar}
														alt={tech.label}
														className="h-6 w-6 rounded-full object-cover"
													/>
												) : (
													<span className="h-6 w-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-semibold">
														{tech.initials}
													</span>
												)}
												<span className="text-sm">{tech.label}</span>
											</span>
										</Link>

										{!isLast && (
											<span className="mx-1 text-sm text-slate-500">
												{isBeforeLast ? "et" : ","}
											</span>
										)}
									</span>
								);
							})}
						</div>
					</div>
				</div>
			</div>

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
			{/* </Section> */}
		</section>
	);
}
