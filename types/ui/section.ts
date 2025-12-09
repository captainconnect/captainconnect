import type { ButtonHTMLAttributes, ReactNode } from "react";

export type LinkType = {
	type: "ACTION" | "NAVIGATE";
	href: string;
};

export type ActionButton = ButtonHTMLAttributes<HTMLButtonElement> & {
	text: string;
	variant?: "normal" | "accent" | "warning" | "danger";
	icon?: ReactNode;
	link?: LinkType;
};
