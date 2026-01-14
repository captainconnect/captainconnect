import type { ReactNode } from "react";

export type TabProps = {
	selected: boolean;
	children?: ReactNode;
};

export default function Tab({ selected, children }: TabProps) {
	if (selected) return <div className="w-full">{children}</div>;
}
