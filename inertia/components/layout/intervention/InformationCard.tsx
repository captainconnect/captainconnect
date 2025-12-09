import type { ReactNode } from "react";

export type InformationCardProps = {
	icon?: ReactNode;
	title: string;
	data: string | number;
	alert?: boolean;
};

export default function InformationCard({
	icon,
	title,
	data,
	alert = false,
}: InformationCardProps) {
	return (
		<div className="flex items-center gap-4 bg-white border border-gray-200 p-6 w-54 rounded-2xl">
			{icon}
			<div className="flex flex-col">
				<span className="font-semibold text-xl text-slate-500">{title}</span>
				<span className={`font-semibold ${alert && "text-red-500"}`}>
					{data}
				</span>
			</div>
		</div>
	);
}
