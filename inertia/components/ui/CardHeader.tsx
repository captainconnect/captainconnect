import type { ReactNode } from "react";
import BackButton from "./buttons/BackButton";
import IconBadge from "./IconBadge";

type CardHeaderProps = {
	title: string;
	subtitle: string;
	icon: ReactNode;
	back?: string;
};

export default function CardHeader({
	icon,
	title,
	subtitle,
	back,
}: CardHeaderProps) {
	return (
		<div className="flex flex-col md:flex-row gap-4">
			{back && <BackButton route={back} />}
			<IconBadge icon={icon} />
			<div className="flex flex-col justify-center">
				<h3 className="text-lg font-semibold">{title}</h3>
				<p className="text-slate-500">{subtitle}</p>
			</div>
		</div>
	);
}
