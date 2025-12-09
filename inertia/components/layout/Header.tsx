import { PanelLeft } from "lucide-react";
import UserMenu from "./UserMenu";

type HeaderProps = {
	setSidebarOpen: (open: boolean) => void;
	title: string;
};

export default function Header({ setSidebarOpen, title }: HeaderProps) {
	return (
		<header className="relative h-16 bg-white flex items-center gap-3 justify-between px-4 md:px-6 border-b border-gray-200">
			<div className="flex items-center gap-3">
				<button
					type="button"
					className="lg:hidden inline-flex items-center justify-center rounded-lg p-2"
					onClick={() => setSidebarOpen(true)}
					aria-label="Ouvrir la barre latérale"
				>
					<PanelLeft color="gray" />
				</button>
				<h1 className="text-lg md:text-2xl font-bold">{title}</h1>
			</div>

			<UserMenu />
		</header>
	);
}
