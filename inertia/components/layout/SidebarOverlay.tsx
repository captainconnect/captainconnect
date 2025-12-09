type SidebarOverlayProps = {
	setSidebarOpen: (open: boolean) => void;
};

export default function SidebarOverlay({
	setSidebarOpen,
}: SidebarOverlayProps) {
	return (
		<div
			onClick={() => setSidebarOpen(false)}
			className="fixed inset-0 z-30 bg-black/40 md:hidden"
			aria-hidden="true"
		/>
	);
}
