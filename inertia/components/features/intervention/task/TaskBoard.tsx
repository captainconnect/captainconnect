import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { TaskGroup } from "#types/intervention";
import TaskGroupElement from "./TaskGroupElement";

type TaskBoardProps = {
	groups: TaskGroup[];
	onGroupsChange: (groups: TaskGroup[]) => void;
	orderingEnabled: boolean;
};

export default function TaskBoard({
	groups,
	onGroupsChange,
	orderingEnabled,
}: TaskBoardProps) {
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = groups.findIndex((g) => g.id === active.id);
		const newIndex = groups.findIndex((g) => g.id === over.id);

		onGroupsChange(arrayMove(groups, oldIndex, newIndex));
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext
				items={groups.map((g) => g.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="space-y-4">
					{groups.map((taskGroup) => (
						<TaskGroupElement
							key={taskGroup.id}
							orderingEnabled={orderingEnabled}
							taskGroup={taskGroup}
							onTasksChange={(tasks) => {
								onGroupsChange(
									groups.map((g) =>
										g.id === taskGroup.id ? { ...g, tasks } : g,
									),
								);
							}}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
