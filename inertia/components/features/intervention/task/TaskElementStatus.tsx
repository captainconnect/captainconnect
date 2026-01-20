import {
	CircleCheckBig,
	Clock,
	type LucideIcon,
	PauseCircle,
} from "lucide-react";

type TaskStatus = "IN_PROGRESS" | "DONE" | "TO_CONTINUE" | "SUSPENDED";

type TaskStatusProps = {
	status: TaskStatus;
};

const STATUS_CONFIG: Record<
	TaskStatus,
	{
		Icon: LucideIcon;
		text: string;
		color: string;
	}
> = {
	IN_PROGRESS: {
		Icon: Clock,
		text: "À faire",
		color: "lightgray",
	},
	TO_CONTINUE: {
		Icon: Clock,
		text: "À continuer",
		color: "lightblue",
	},
	DONE: {
		Icon: CircleCheckBig,
		text: "Terminée",
		color: "green",
	},
	SUSPENDED: {
		Icon: PauseCircle,
		text: "Suspendue",
		color: "orange",
	},
};

export function TaskStatusIcon({ status }: TaskStatusProps) {
	const { Icon, color } = STATUS_CONFIG[status];
	return <Icon size={24} color={color} />;
}

export function TaskStatusText({ status }: TaskStatusProps) {
	return STATUS_CONFIG[status].text;
}
