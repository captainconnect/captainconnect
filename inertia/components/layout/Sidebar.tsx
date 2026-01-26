import type { NavLinkRoute } from "#types/nav";
import NavItem from "./NavItem";
import Title from "./Title";
import Version from "./Version";

type SidebarProps = {
	open: boolean;
	setSidebarOpen: (value: boolean) => void;
	routes: NavLinkRoute[];
};

export default function Sidebar({
	open,
	setSidebarOpen,
	routes,
}: SidebarProps) {
	return (
		<aside
			className={`fixed inset-y-0 left-0 z-40 py-4 w-64 bg-primary text-white border-r border-white/10 transform transition-transform duration-200 ease-out flex flex-col justify-between
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
			aria-label="Navigation principale"
		>
			<div>
				<Title />
				<div className="flex flex-col p-3 gap-4">
					<div className="h-px bg-white/10" />
					<nav>
						<ul className="flex flex-col mt-2 gap-7 justify-center">
							{routes.map((r) => (
								<NavItem
									key={r.label}
									route={r.route}
									icon={r.icon}
									label={r.label}
									onClick={() => setSidebarOpen(false)}
								/>
							))}
						</ul>
					</nav>
				</div>
			</div>
			<Version onClick={() => setSidebarOpen(false)} />
		</aside>
	);
}
