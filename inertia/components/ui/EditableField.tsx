import type { InputHTMLAttributes } from "react";
import Input from "./inputs/Input";

type EditableFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	editing: boolean;
	value: string;
	error?: string;
	undefinedLabel?: string;
};

export default function EditableField({
	editing,
	error,
	value,
	onChange,
	undefinedLabel = "Non défini",
	...props
}: EditableFieldProps) {
	if (editing) {
		return (
			<div>
				<Input onChange={onChange} value={value} {...props} />
				{error && <p className="text-red-500">{error}</p>}
			</div>
		);
	}
	return <p>{value ? value : undefinedLabel}</p>;
}
