import { Link } from "@inertiajs/react";
import type { NavLinkRoute } from "#types/nav";

type NavItemProps = NavLinkRoute & {
	onClick: () => void;
};

export default function NavItem({ route, label, icon, onClick }: NavItemProps) {
	return (
		<li>
			<Link
				href={route}
				className="flex gap-4 hover:bg-primary-hover transition p-3 rounded-xl active:scale-95"
				onClick={onClick}
			>
				{icon}
				{label}
			</Link>
		</li>
	);
}
