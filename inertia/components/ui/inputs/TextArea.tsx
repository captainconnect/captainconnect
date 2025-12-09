import { type TextareaHTMLAttributes, useId } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	error?: string | undefined;
};

export default function Textarea({
	error,
	value,
	label,
	...props
}: TextareaProps) {
	const id = useId();
	return (
		<div className="w-full flex flex-col gap-2">
			{label && <label htmlFor={id}>{label}</label>}
			<div>
				<textarea
					id={id}
					className="p-3 bg-white outline-none transition border border-border rounded-xl w-full text-md focus-within:ring-2 focus-within:ring-gray"
					{...props}
					value={value}
				></textarea>
				{error && <span className="text-red-500">{error}</span>}
			</div>
		</div>
	);
}
