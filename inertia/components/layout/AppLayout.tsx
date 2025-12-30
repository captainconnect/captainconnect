import { usePage } from "@inertiajs/react";
import {
	LayoutDashboard,
	Ship,
	SquareUserRound,
	UserLock,
	UserRoundCog,
	Wrench,
} from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import type { NavLinkRoute } from "#types/nav";
import type { User } from "#types/user";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarOverlay from "./SidebarOverlay";

type AppLayoutProps = PropsWithChildren & {
	title: string;
};

export default function AppLayout({ children, title }: AppLayoutProps) {
	const [sideBarOpen, setSidebarOpen] = useState(false);

	const { props } = usePage<{ authenticatedUser: User }>();
	const currentUser = props.authenticatedUser;

	const routes: NavLinkRoute[] = [
		{ label: "Tableau de bord", route: "/", icon: <LayoutDashboard /> },
		{ label: "Interventions", route: "/interventions", icon: <Wrench /> },
		{ label: "Bateaux", route: "/bateaux", icon: <Ship /> },
		{ label: "Contacts", route: "/contacts", icon: <SquareUserRound /> },
		{ label: "Utilisateurs", route: "/utilisateurs", icon: <UserRoundCog /> },
	];
	if (currentUser.isAdmin) {
		routes.push({
			label: "Administration",
			route: "/administration",
			icon: <UserLock />,
		});
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{sideBarOpen && <SidebarOverlay setSidebarOpen={setSidebarOpen} />}
			<Sidebar
				setSidebarOpen={setSidebarOpen}
				routes={routes}
				open={sideBarOpen}
			/>

			<div className="flex flex-col flex-1 min-w-0">
				<Header title={title} setSidebarOpen={setSidebarOpen} />
				<main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
