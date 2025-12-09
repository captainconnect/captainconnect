import { Link } from "@inertiajs/react";
import { Check, CircleCheckBig, Clock, Plus } from "lucide-react";
import { useState } from "react";
import type { Intervention } from "#types/intervention";
import type { User } from "#types/user";
import Button from "~/components/ui/buttons/Button";
import Section from "~/components/ui/Section";
import type { TabProps } from "~/components/ui/Tab";
import Tab from "~/components/ui/Tab";
import TaskModal from "./TaskModal";

type TaskTabProps = TabProps & {
	intervention: Intervention;
	users: User[];
};

export default function TaskTab({ selected, intervention }: TaskTabProps) {
	const taskGroups = intervention.taskGroups || [];

	const [openTaskModal, setOpenTaskModal] = useState(false);

	return (
		<>
			<Tab selected={selected}>
				<Section
					title="Tâches"
					subtitle="Liste des tâches organisées par groupes"
					icon={<Check />}
					button={
						<Button
							className="w-full md:w-auto"
							icon={<Plus />}
							onClick={() => setOpenTaskModal(true)}
						>
							Nouvelle tâche
						</Button>
					}
				>
					{taskGroups.map((tg) => (
						<div key={tg.name + tg.id} className="mt-4">
							<h3 className="text-xl font-semibold">{tg.name}</h3>
							<ul className="mt-2 space-y-2">
								{tg.tasks.map((t) => (
									<li key={`${tg.name}-${t.name}`}>
										<Link
											href={`/interventions/${intervention.slug}/task/${t.id}`}
											className="flex items-center gap-4 justify-between bg-background p-3 rounded-lg border border-gray-200 cursor-pointer w-full active:scale-[99%] transition"
										>
											<div className="flex items-center gap-4">
												{t.status === "DONE" ? (
													<CircleCheckBig size="24" color="green" />
												) : (
													<Clock size="24" color="lightgray" />
												)}
												<div>
													<p className="font-semibold text-left">{t.name}</p>
													<p className="text-sm text-subtitle text-left">
														{t.status === "IN_PROGRESS"
															? "À faire"
															: "Terminée"}
													</p>
												</div>
											</div>
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</Section>
			</Tab>
			<TaskModal
				interventionSlug={intervention.slug}
				taskGroups={taskGroups}
				open={openTaskModal}
				onClose={() => setOpenTaskModal(false)}
			/>
		</>
	);
}
