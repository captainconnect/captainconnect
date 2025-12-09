import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function SearchInput({ ...props }: SearchInputProps) {
	return (
		<div className="flex items-center p-3 bg-white outline-none transition border border-border rounded-xl md:w-1/2 text-md focus-within:ring-2 focus-within:ring-primary gap-4">
			<Search color="gray" />
			<input
				name="search"
				className="outline-none w-full"
				type="search"
				{...props}
			></input>
		</div>
	);
}
