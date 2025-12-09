import type { HttpError } from "@adonisjs/core/types/http";
import { Head, Link } from "@inertiajs/react";
import Logo from "~/components/ui/Logo";

export default function ServerError(props: { error?: HttpError }) {
	return (
		<>
			<Head title="Page non trouvée" />
			<div className="w-full h-screen flex flex-col items-center justify-center gap-4">
				<Logo className="size-48" />
				<div className="title text-2xl font-semibold">Erreur interne</div>

				<span>{props?.error?.message}</span>

				<Link href="/" className="text-primary-hover">
					Revenir au tableau de bord
				</Link>
			</div>
		</>
	);
}
