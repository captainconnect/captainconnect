import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

export type InformationCardProps = {
	icon?: ReactNode;
	title: string;
	data: string | number;
	alert?: boolean;
	link?: string;
};

export default function InformationCard({
	icon,
	title,
	data,
	alert = false,
	link,
}: InformationCardProps) {
	const className =
		"flex items-center gap-4 bg-white border border-gray-200 p-6 w-54 rounded-2xl";
	console.log(link);
	const content = (
		<>
			{icon}
			<div className="flex flex-col">
				<span className="font-semibold text-xl text-slate-500">{title}</span>
				<span className={`font-semibold ${alert && "text-red-500"}`}>
					{data}
				</span>
			</div>
		</>
	);
	return link ? (
		<Link className={`${className} transition active:scale-95`} href={link}>
			{content}
		</Link>
	) : (
		<div className={className}>{content}</div>
	);
}
