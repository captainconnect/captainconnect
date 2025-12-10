type LogoProps = {
	className?: string;
	variant?: "blue" | "black" | "white" | "blue-white";
};

export default function Logo({ className, variant = "blue" }: LogoProps) {
	return (
		<img
			className={className}
			src={`/logo-${variant}.svg`}
			alt="Logo de Cap'tain Connect"
		/>
	);
}
