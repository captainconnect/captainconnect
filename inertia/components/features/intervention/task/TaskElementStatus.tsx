import { CircleCheckBig, Clock } from "lucide-react";

type TaskStatusProps = {
	status: "IN_PROGRESS" | "DONE" | "TO_CONTINUE";
};

export function TaskStatusIcon({ status }: TaskStatusProps) {
	return status === "IN_PROGRESS" ? (
		<Clock size="24" color="lightgray" />
	) : (
		<CircleCheckBig
			size="24"
			color={status === "DONE" ? "green" : "lightblue"}
		/>
	);
}

export function TaskStatusText({ status }: TaskStatusProps) {
	return status === "DONE"
		? "Terminée"
		: status === "TO_CONTINUE"
			? "À continuer"
			: "À faire";
}
