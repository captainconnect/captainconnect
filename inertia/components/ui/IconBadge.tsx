import type { ReactNode } from "react";

type IconBadgeProps = {
	icon: ReactNode;
};

export default function IconBadge({ icon }: IconBadgeProps) {
	return (
		<div className="bg-primary w-12 h-12 text-white flex items-center justify-center rounded-xl">
			{icon}
		</div>
	);
}
