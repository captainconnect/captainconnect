import { CircleCheckBig, Clock } from "lucide-react";
import type { TaskStatus } from "#types/intervention";

type TaskStatusProps = {
	status: TaskStatus;
};

export function TaskStatusIcon({ status }: TaskStatusProps) {
	return status === "DONE" ? (
		<CircleCheckBig size="24" color="green" />
	) : (
		<Clock size="24" color="lightgray" />
	);
}

export function TaskStatusText({ status }: TaskStatusProps) {
	return status === "IN_PROGRESS" ? "À faire" : "Terminée";
}
