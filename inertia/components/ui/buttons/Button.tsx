import { Link } from "@inertiajs/react";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: "icon" | "sm" | "md";
	icon?: ReactNode;
	href?: string;
};

export default function Button({
	variant = "primary",
	size = "md",
	type = "button",
	icon,
	href,
	children,
	className,
	...props
}: ButtonProps) {
	const base =
		"flex items-center justify-center gap-2 font-semibold rounded-2xl border-2 transition active:scale-95 cursor-pointer text-sm w-auto max-h-10";

	const sizes = {
		icon: "p-1",
		sm: "px-2 py-1 text-xs",
		md: "px-4 py-2 sm:px-5",
	}[size];

	const variants = {
		primary: "bg-primary border-transparent text-white hover:bg-primary-hover",
		secondary: "text-primary border-primary",
		danger: "bg-red-600 border-transparent text-white hover:bg-red-700",
	}[variant];

	const content = (
		<>
			{icon && <span className="shrink-0">{icon}</span>}
			{children && <span>{children}</span>}
		</>
	);

	const classes = clsx(base, sizes, variants, className);

	if (href)
		return (
			<Link href={href} className={classes}>
				{content}
			</Link>
		);

	return (
		<button type={type} className={classes} {...props}>
			{content}
		</button>
	);
}
