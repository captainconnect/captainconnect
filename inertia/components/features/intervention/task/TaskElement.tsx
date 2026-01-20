import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, usePage } from "@inertiajs/react";
import type { Task } from "#types/intervention";
import type { IndexTaskPageProps } from "~/pages/interventions/tasks";
import { TaskStatusIcon, TaskStatusText } from "./TaskElementStatus";

type TaskElementProps = {
	task: Task;
	orderingEnabled: boolean;
};

export default function TaskElement({
	task,
	orderingEnabled,
}: TaskElementProps) {
	const { intervention } = usePage<IndexTaskPageProps>().props;

	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({
		id: task.id, // ✅ number OK
		disabled: !orderingEnabled, // ✅ drag seulement en mode ordering
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const status =
		task.suspensionReason !== null
			? "SUSPENDED"
			: task.status === "DONE"
				? "DONE"
				: task.status === "IN_PROGRESS" &&
						task.workDones &&
						task.workDones.length > 0
					? "TO_CONTINUE"
					: "IN_PROGRESS";

	return (
		<li ref={setNodeRef} style={style}>
			<div
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
				className={`w-full ${orderingEnabled ? "cursor-grab active:cursor-grabbing" : ""}`}
			>
				<Link
					href={`/interventions/${intervention.slug}/taches/${task.id}`}
					className={`flex items-center gap-4 justify-between bg-white p-3 rounded-lg border border-gray-200 w-full transition
            ${orderingEnabled && "pointer-events-none select-none"}`}
					tabIndex={orderingEnabled ? -1 : 0}
					aria-disabled={orderingEnabled}
				>
					<div className="flex items-center gap-4">
						<TaskStatusIcon status={status} />
						<div>
							<p className="font-semibold text-left">{task.name}</p>
							<p className="text-sm text-subtitle text-left">
								<TaskStatusText status={status} />
								{status === "SUSPENDED" && ` : ${task.suspensionReason}`}
							</p>
						</div>
					</div>
				</Link>
			</div>
		</li>
	);
}
