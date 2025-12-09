import type { ReactNode } from "react";

export type InformationBlockItemProps = {
	icon?: ReactNode;
	label: string;
	value?: string | number | null;
};

export default function InformationBlockItem({
	icon,
	label,
	value,
}: InformationBlockItemProps) {
	return (
		<div>
			<p className="text-slate-400 text-sm flex items-center gap-1">
				{icon && icon}
				{label}
			</p>
			<p className="font-medium">{value ? value : "Non défini"}</p>
		</div>
	);
}
