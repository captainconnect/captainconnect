import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type Option = {
	id: number | string;
	label: string;
};

type MultipleSelectProps = {
	options: Option[];
	label?: string;
	value: (string | number)[];
	onChange: (value: (string | number)[]) => void;
	placeholder?: string;
};

export default function MultipleSelect({
	options,
	label,
	value,
	onChange,
	placeholder = "Sélectionner...",
}: MultipleSelectProps) {
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	// fermer au clic extérieur
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const toggle = (id: string | number) => {
		if (value.includes(id)) {
			onChange(value.filter((v) => v !== id));
		} else {
			onChange([...value, id]);
		}
	};

	const selectedLabels = options
		.filter((o) => value.includes(o.id))
		.map((o) => o.label);

	return (
		<div ref={ref} className="w-full flex flex-col gap-2">
			{label && (
				<label htmlFor={id} className="text-primary">
					{label}
				</label>
			)}

			{/* Input */}
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="p-3 bg-white border border-gray-200 rounded-xl text-left flex justify-between items-center"
			>
				<span className="truncate text-gray-700">
					{selectedLabels.length ? selectedLabels.join(", ") : placeholder}
				</span>
				<span className="text-gray-400">
					<ChevronDown size="14" />
				</span>
			</button>

			{/* Dropdown */}
			{open && (
				<div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
					{options.map((o) => (
						<label
							key={o.id}
							className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
						>
							<input
								type="checkbox"
								checked={value.includes(o.id)}
								onChange={() => toggle(o.id)}
								className="accent-primary"
							/>
							<span>{o.label}</span>
						</label>
					))}
				</div>
			)}
		</div>
	);
}
