import type { SharedProps } from "@adonisjs/inertia/types";
import { Link, router, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function UserMenu() {
	const { authenticatedUser } = usePage<SharedProps>().props;
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const closeMenu = useCallback(() => {
		setOpen(false);
	}, []);

	// Gestion du clic extérieur
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				closeMenu();
			}
		}

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open, closeMenu]);
	return (
		<div ref={menuRef} className="relative">
			<button
				type="button"
				onClick={toggleMenu}
				aria-haspopup="true"
				aria-expanded={open}
				className="flex items-center gap-2 px-3 py-1 rounded-xl cursor-pointer hover:bg-blue-100 transition active:scale-95"
			>
				<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm">
					{authenticatedUser?.initials}
				</span>

				<div className="hidden md:flex flex-col text-left">
					<span className="text-sm font-semibold">
						{authenticatedUser?.firstname} {authenticatedUser?.lastname}
					</span>
					{authenticatedUser?.role && (
						<span className="text-xs text-gray-500">
							{authenticatedUser?.role.name}
						</span>
					)}
				</div>
			</button>

			{/* Menu */}
			{open && (
				<div
					role="menu"
					className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg ring-1 ring-black/5 z-50"
				>
					<div className="px-4 py-3">
						<p className="text-sm font-semibold">Mon Compte</p>
					</div>

					<div className="py-1">
						<Link
							href="/profile"
							role="menuitem"
							className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50"
							onClick={closeMenu}
						>
							Profil
						</Link>
					</div>

					<div className="border-t border-gray-100" />

					{/* Logout */}
					<button
						type="button"
						onClick={() => router.delete("/logout")}
						className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm cursor-pointer"
					>
						Déconnexion
					</button>
				</div>
			)}
		</div>
	);
}
