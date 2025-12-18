import type { ReactNode } from "react";
import BackButton from "../ui/buttons/BackButton";
import Button, { type ButtonVariant } from "../ui/buttons/Button";
import SearchInput from "../ui/inputs/SearchInput";

type PageHeaderProps = {
	title: string;
	subtitle?: string;
	backButton?: {
		route: string;
	};
	search?: {
		disabled: boolean;
		onChange: (value: string) => void;
		value: string;
		placeholder: string;
	};
	buttons?: {
		label: string;
		onClick?: () => void;
		href?: string;
		disabled?: boolean;
		icon: ReactNode;
		variant?: ButtonVariant;
	}[];
	tag?: {
		className: string;
		icon?: ReactNode;
		label: string;
	};
};

export default function PageHeader({
	title,
	subtitle,
	search,
	buttons,
	backButton,
	tag,
}: PageHeaderProps) {
	return (
		<>
			<div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-4">
				<div className="flex gap-4">
					{backButton && <BackButton route={backButton.route} />}
					<div>
						{tag ? (
							<div className="flex gap-2">
								<h2 className="text-3xl font-bold">{title}</h2>
								<span
									className={`flex ${tag.className} px-2 rounded-full text-sm items-center gap-1 text-white`}
								>
									{tag.icon && tag.icon} {tag.label}
								</span>
							</div>
						) : (
							<h2 className="text-3xl font-bold">{title}</h2>
						)}
						<p className="text-md text-gray-500">{subtitle}</p>
					</div>
				</div>
				{search && (
					<SearchInput
						disabled={search.disabled}
						type="search"
						value={search.value}
						onChange={(e) => search.onChange(e.target.value)}
						placeholder={search.placeholder}
					/>
				)}
				<div className="flex flex-col md:flex-row gap-2 items-center">
					{buttons?.map((b) => (
						<Button
							key={b.label}
							href={b.href}
							onClick={b.onClick}
							icon={b.icon}
							variant={b.variant}
							disabled={b.disabled}
							className="flex items-center w-full md:w-auto"
						>
							{b.label}
						</Button>
					))}
				</div>
			</div>
			<hr className="text-gray-200 m-5 " />
		</>
	);
}
