import { Eye, EyeOff } from "lucide-react";
import { type InputHTMLAttributes, useId, useState } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
};

const baseClasses =
	"flex items-center p-3 bg-white border border-border rounded-xl w-full text-md transition focus-within:ring-2 focus-within:ring-primary";

export default function Input({
	label,
	type = "text",
	error,
	...props
}: InputProps) {
	const id = useId();
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";

	return (
		<div className="w-full flex flex-col gap-2">
			{label && (
				<label htmlFor={id} className="text-primary">
					{label}
				</label>
			)}

			<div className={baseClasses}>
				<input
					id={id}
					type={isPassword && showPassword ? "text" : type}
					className="w-full bg-transparent outline-none"
					{...props}
				/>

				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						tabIndex={-1}
						className="ml-2 text-muted-foreground cursor-pointer"
						aria-label={
							showPassword
								? "Masquer le mot de passe"
								: "Afficher le mot de passe"
						}
					>
						{showPassword ? <Eye color="gray" /> : <EyeOff color="gray" />}
					</button>
				)}
			</div>

			{error && <span className="text-red-500 text-sm">{error}</span>}
		</div>
	);
}
