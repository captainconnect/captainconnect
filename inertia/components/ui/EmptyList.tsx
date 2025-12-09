import type { ReactNode } from "react";

type EmptyListProps = {
	icon: ReactNode;
	text: string;
	nested?: boolean;
};

export default function EmptyList({
	icon,
	text,
	nested = false,
}: EmptyListProps) {
	return (
		<section
			className={`mt-6 bg-white flex flex-col items-center justify-center gap-4 text-slate-500 ${!nested ? "p-12" : "p-6"} ${!nested && "rounded-2xl border border-gray-200"}`}
		>
			{icon}
			<p className="text-md text-gray-500 text-center">{text}</p>
		</section>
	);
}
