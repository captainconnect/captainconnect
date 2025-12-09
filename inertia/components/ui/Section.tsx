import { type ReactNode, useId } from "react";
import IconBadge from "./IconBadge";

type SectionProps = {
	icon?: ReactNode;
	title: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
	button?: ReactNode;
};

export default function Section({
	icon,
	title,
	subtitle,
	children,
	className = "",
	button,
}: SectionProps) {
	const id = useId();
	return (
		<section
			className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}
			key={id}
		>
			<div className="flex flex-col md:flex-row md:items-center justify-between">
				<div className="flex gap-4 mb-4">
					{icon && <IconBadge icon={icon} />}
					<div
						className={
							subtitle ? "" : "justify-center flex flex-col items-center"
						}
					>
						<p className="text-lg font-semibold">{title}</p>
						{subtitle && <p className="text-slate-500">{subtitle}</p>}
					</div>
				</div>
				{button && button}
			</div>
			{children}
		</section>
	);
}
