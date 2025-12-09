import { ListCheck, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import type { TaskStatus } from "#types/intervention";
import Button from "~/components/ui/buttons/Button";
import CardHeader from "~/components/ui/CardHeader";
import Input from "~/components/ui/inputs/Input";

type Task = {
	name: string;
	status?: TaskStatus;
};

type TaskGroup = {
	name: string;
	tasks: Task[];
};

type AddTaskBoardProps = {
	data: {
		taskGroups: TaskGroup[];
	};
	setData: (key: string, value: TaskGroup[]) => void;
};

export default function AddTaskBoard({ data, setData }: AddTaskBoardProps) {
	const [newGroup, setNewGroup] = useState("");
	const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});

	const taskInputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const addGroup = () => {
		if (!newGroup.trim()) return;

		const newG = { name: newGroup, tasks: [] };

		setData("taskGroups", [newG, ...data.taskGroups]);

		setNewGroup("");

		setTimeout(() => {
			taskInputRefs.current[0]?.focus();
		}, 10);
	};

	const removeGroup = (index: number) => {
		setData(
			"taskGroups",
			data.taskGroups.filter((_, i) => i !== index),
		);
	};

	const addTask = (groupIndex: number) => {
		const taskText = newTaskTexts[groupIndex]?.trim();
		if (!taskText) return;

		setData(
			"taskGroups",
			data.taskGroups.map((group, i) =>
				i === groupIndex
					? { ...group, tasks: [...group.tasks, { name: taskText }] }
					: group,
			),
		);
		setNewTaskTexts({ ...newTaskTexts, [groupIndex]: "" });
	};

	const removeTask = (groupIndex: number, taskIndex: number) => {
		setData(
			"taskGroups",
			data.taskGroups.map((group, i) =>
				i === groupIndex
					? { ...group, tasks: group.tasks.filter((_, j) => j !== taskIndex) }
					: group,
			),
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<CardHeader
				title="Travaux demandés"
				subtitle="Organisez les tâches"
				icon={<ListCheck />}
			/>
			<div className="flex items-center gap-4">
				<Input
					placeholder="Nouveau groupe de tâches"
					onChange={(e) => setNewGroup(e.target.value)}
					value={newGroup}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addGroup();
						}
					}}
				/>
				<Button
					onClick={addGroup}
					icon={<Plus />}
					title="Ajouter un groupe de tâches"
				/>
			</div>
			<hr className="text-gray-200 my-2" />
			{data.taskGroups.map((group, groupIndex) => (
				<div
					key={`index-${group.name}`}
					className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-6"
				>
					<div className="flex items-center justify-between">
						<p className="font-semibold text-lg">{group.name}</p>
						<button
							type="button"
							onClick={() => removeGroup(groupIndex)}
							className="p-1 transition hover:bg-gray-200 cursor-pointer rounded-full active:scale-95"
						>
							<X size={20} color="#444" />
						</button>
					</div>

					{/* --- Tâches --- */}
					<ul className="space-y-2 pl-4">
						{group.tasks.map((task, taskIndex) => (
							<li
								key={`task-${task.name}`}
								className="flex items-center justify-between gap-2"
							>
								<input type="hidden" name="status" value={task.status} />
								<p>{task.name}</p>
								<button
									type="button"
									onClick={() => removeTask(groupIndex, taskIndex)}
									className="p-1 transition hover:bg-gray-200 cursor-pointer rounded-full active:scale-95"
								>
									<X size={18} color="#444" />
								</button>
							</li>
						))}
					</ul>
					<div className="flex items-center gap-4 w-full">
						<input
							ref={(el) => {
								taskInputRefs.current[groupIndex] = el;
							}}
							className="w-full px-4 p-2 bg-white rounded-xl border border-gray-200"
							placeholder="Nouvelle tâche"
							onChange={(e) =>
								setNewTaskTexts({
									...newTaskTexts,
									[groupIndex]: e.target.value,
								})
							}
							value={newTaskTexts[groupIndex] || ""}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTask(groupIndex);
								}
							}}
						/>
						<button
							type="button"
							onClick={() => addTask(groupIndex)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addTask(groupIndex);
								}
							}}
							title="Ajouter une tâche"
							className="p-1 rounded-full bg-blue-950 text-white active:scale-95 transition cursor-pointer"
						>
							<Plus />
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
