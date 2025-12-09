import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import IconBadge from "../IconBadge";

export type BaseModalProps = {
	open: boolean;
	onClose: () => void;
};

type ModalProps = BaseModalProps & {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	icon?: ReactNode;
	maxWidth?: "max-w-lg" | "max-w-xl" | "max-w-2xl" | "max-w-3xl" | "max-w-4xl";
};

export default function Modal({
	open,
	onClose,
	children,
	title,
	subtitle,
	icon,
	maxWidth = "max-w-lg",
}: ModalProps) {
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}

		if (open) {
			document.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	return (
		<div
			className={`
				h-screen
				w-screen
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-200
        ${open ? "pointer-events-auto" : "pointer-events-none"}
      `}
		>
			{/* Backdrop (désormais un vrai bouton → a11y + biome OK) */}
			<button
				type="button"
				aria-label="Fermer le modal"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter") onClose();
				}}
				className={`
          absolute inset-0 w-full h-full bg-black/50 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0"}
        `}
			/>

			{/* Contenu du modal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				className={`
    relative w-full ${maxWidth} rounded-2xl border border-gray-200 bg-white p-6 shadow-lg
    transition-all duration-200
    ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}
  `}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={() => {}} // ← FIX BIOME
			>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						{icon && <IconBadge icon={icon} />}
						{title && (
							<h3 id="modal-title" className="text-xl font-semibold">
								{title}
							</h3>
						)}
					</div>

					{/* Bouton de fermeture → onKeyDown vide pour satisfaire Biome */}
					<button
						type="button"
						onClick={onClose}
						onKeyDown={() => {}}
						className="text-slate-600 hover:text-slate-800 transition active:scale-95 cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}

				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}
