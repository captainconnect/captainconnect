type TabSelector = {
	scope: string;
	label: string;
	setSelectedTab: (scope: string) => void;
	isSelected: boolean;
	disabled?: boolean;
};

export default function TabSelector({
	scope,
	setSelectedTab,
	label,
	isSelected,
	disabled = false,
}: TabSelector) {
	return (
		<button
			type="button"
			role="tab"
			disabled={disabled}
			onClick={() => setSelectedTab(scope)}
			className={`p-2 w-1/3 ${isSelected && "bg-white"} rounded-xl cursor-pointer transition text-slate-500`}
		>
			{label}
		</button>
	);
}
