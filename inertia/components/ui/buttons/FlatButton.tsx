import { Link } from "@inertiajs/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkType } from "#types/ui/section";

export type FlatButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "normal" | "accent" | "warning" | "danger";
	icon?: ReactNode;
	children: ReactNode;
	link?: LinkType;
};

export default function FlatButton({
	icon,
	children,
	variant = "normal",
	link,
	...props
}: FlatButtonProps) {
	const classes = `flex ${variant === "warning" ? "text-yellow-600" : variant === "danger" ? "text-red-500" : variant === "accent" ? "text-primary" : ""} p-2 px-4 gap-2 items-center bg-slate-50 border border-gray-200 rounded-xl w-full cursor-pointer hover:bg-slate-100 transition active:scale-[99%]`;

	if (link) {
		if (link.type === "ACTION") {
			return (
				<a className={classes} href={link.href}>
					{icon && icon} {children}
				</a>
			);
		} else {
			return (
				<Link className={classes} href={link.href}>
					{icon && icon} {children}
				</Link>
			);
		}
	} else {
		return (
			<button className={classes} {...props}>
				{icon && icon} {children}
			</button>
		);
	}
}
