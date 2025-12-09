import { type SelectHTMLAttributes, useId } from "react";

type Option = {
	id: number;
	label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	options: Option[];
	label?: string;
	value?: string | number;
	allowNull?: boolean;
};

export default function Select({
	options,
	label,
	allowNull = true,
	...props
}: SelectProps) {
	const id = useId();
	return (
		<div className="w-full flex flex-col gap-2">
			{label && (
				<label className="text-primary" htmlFor={id}>
					{label}
				</label>
			)}
			<select
				className="p-3 bg-white border border-gray-200 rounded-xl"
				{...props} // contient value et onChange → contrôlé
				id={id}
			>
				{allowNull && <option value="">Aucun</option>}
				{options.map((o) => (
					<option key={o.id} value={o.id}>
						{o.label}
					</option>
				))}
			</select>
		</div>
	);
}
