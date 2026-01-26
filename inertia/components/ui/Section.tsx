import { type ReactNode, useId } from "react";
import IconBadge from "./IconBadge";

type SectionProps = {
	icon?: ReactNode;
	title: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
	button?: ReactNode;
	image?: string | null;
};

export default function Section({
	icon,
	title,
	subtitle,
	children,
	className = "",
	button,
	image,
}: SectionProps) {
	const id = useId();
	return (
		<section
			className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}
			key={id}
		>
			<div className="flex flex-col md:flex-row md:items-center justify-between">
				<div className="flex gap-4 mb-4">
					{!image && icon ? (
						<IconBadge icon={icon} />
					) : (
						image && (
							<a href={image} target="_blank">
								<img
									className="size-24 rounded-xl"
									src={image}
									alt="Thumbnail du bateau"
								/>
							</a>
						)
					)}
					<div
						className={
							subtitle ? "" : "justify-center flex flex-col items-center"
						}
					>
						<p className="text-lg font-semibold">{title}</p>
						{subtitle && (
							<p className="text-slate-500 hidden md:block">{subtitle}</p>
						)}
					</div>
				</div>
				{button && button}
			</div>
			{children}
		</section>
	);
}
