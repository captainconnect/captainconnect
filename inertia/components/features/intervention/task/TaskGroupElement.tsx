import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskGroup } from "#types/intervention";
import TaskElement from "./TaskElement";

type TaskGroupElementProps = {
	taskGroup: TaskGroup;
	onTasksChange: (tasks: Task[]) => void;
	orderingEnabled: boolean;
};

export default function TaskGroupElement({
	taskGroup,
	onTasksChange,
	orderingEnabled,
}: TaskGroupElementProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: taskGroup.id, disabled: !orderingEnabled });

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	function handleTaskDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = taskGroup.tasks.findIndex((t) => t.id === active.id);
		const newIndex = taskGroup.tasks.findIndex((t) => t.id === over.id);

		onTasksChange(arrayMove(taskGroup.tasks, oldIndex, newIndex));
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="rounded-xl border border-gray-200 p-4 bg-slate-100"
		>
			{/* Header draggable */}
			<div
				{...attributes}
				{...listeners}
				className={`mb-4 text-xl font-semibold ${orderingEnabled && "cursor-grab active:cursor-grabbing"} select-none`}
			>
				{taskGroup.name}
			</div>

			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleTaskDragEnd}
			>
				<SortableContext
					items={taskGroup.tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
					disabled={!orderingEnabled}
				>
					<ul className="mt-2 space-y-2">
						{taskGroup.tasks.map((task) => (
							<TaskElement
								orderingEnabled={orderingEnabled}
								key={task.id}
								task={task}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
}
