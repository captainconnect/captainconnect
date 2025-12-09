import type { ReactNode } from "react";

type CardProps = {
	children: ReactNode;
	className?: string;
};

export default function Card({ children, className }: CardProps) {
	return (
		<div
			className={`${className} bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl`}
		>
			{children}
		</div>
	);
}
