import { type PropsWithChildren, useState } from "react";
import { routes } from "../../app/routes";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarOverlay from "./SidebarOverlay";

type AppLayoutProps = PropsWithChildren & {
	title: string;
};

export default function AppLayout({ children, title }: AppLayoutProps) {
	const [sideBarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden">
			{sideBarOpen && <SidebarOverlay setSidebarOpen={setSidebarOpen} />}
			<Sidebar
				setSidebarOpen={setSidebarOpen}
				routes={routes}
				open={sideBarOpen}
			/>

			<div className="flex flex-col flex-1 min-w-0">
				<Header title={title} setSidebarOpen={setSidebarOpen} />
				<main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
