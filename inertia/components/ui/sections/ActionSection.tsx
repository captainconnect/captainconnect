import type { ReactNode } from "react";
import type { ActionButton } from "#types/ui/section";
import FlatButton from "../buttons/FlatButton";
import Section from "../Section";

type ActionSectionProps = {
	className?: string;
	title: string;
	icon?: ReactNode;
	buttons: ActionButton[];
};

export default function ActionSection({
	title,
	icon,
	buttons,
	className,
}: ActionSectionProps) {
	return (
		<Section className={`space-y-2 ${className}`} title={title} icon={icon}>
			{buttons.map((b) => (
				<FlatButton
					key={`${b.text}-${b.variant}`}
					variant={b.variant}
					icon={b.icon}
					onClick={b.onClick}
					link={b.link}
				>
					{b.text}
				</FlatButton>
			))}
		</Section>
	);
}
