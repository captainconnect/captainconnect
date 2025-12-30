import type { ReactNode } from "react";
import type { ActionButton } from "#types/ui/section";
import AdminChecker from "~/components/features/AdminChecker";
import FlatButton from "../buttons/FlatButton";
import Section from "../Section";

type ActionSectionProps = {
	className?: string;
	title: string;
	icon?: ReactNode;
	buttons: ActionButton[];
	mustBeAdmin?: boolean;
};

export default function ActionSection({
	title,
	icon,
	buttons,
	className,
	mustBeAdmin,
}: ActionSectionProps) {
	return (
		<AdminChecker mustBeAdmin={mustBeAdmin}>
			<Section className={`space-y-2 ${className}`} title={title} icon={icon}>
				{buttons.map((b) => (
					<FlatButton
						key={`${b.text}-${b.variant}`}
						variant={b.variant}
						icon={b.icon}
						onClick={b.onClick}
						link={b.link}
						mustBeAdmin={b.mustBeAdmin}
					>
						{b.text}
					</FlatButton>
				))}
			</Section>
		</AdminChecker>
	);
}
