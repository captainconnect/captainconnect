import type { ReactNode } from "react";

type IconBadgeProps = {
	icon: ReactNode;
	size?: string;
};

export default function IconBadge({ icon, size = "12" }: IconBadgeProps) {
	return (
		<div
			className={`bg-primary size-${size} text-white flex items-center justify-center rounded-xl`}
		>
			{icon}
		</div>
	);
}
