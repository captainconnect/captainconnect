import {
	LayoutDashboard,
	Ship,
	SquareUserRound,
	UserRoundCog,
	Wrench,
} from "lucide-react";
import type { NavLinkRoute } from "#types/nav";

export const routes: NavLinkRoute[] = [
	{ label: "Tableau de bord", route: "/", icon: <LayoutDashboard /> },
	{ label: "Interventions", route: "/interventions", icon: <Wrench /> },
	{ label: "Bateaux", route: "/bateaux", icon: <Ship /> },
	{ label: "Contacts", route: "/contacts", icon: <SquareUserRound /> },
	{ label: "Utilisateurs", route: "/utilisateurs", icon: <UserRoundCog /> },
];
