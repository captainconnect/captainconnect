import { Head, Link } from "@inertiajs/react";
import Logo from "~/components/ui/Logo";

export default function NotFound() {
	return (
		<>
			<Head title="Page non trouvée" />
			<div className="w-full h-screen flex flex-col items-center justify-center gap-4">
				<Logo className="size-48" />
				<div className="title text-2xl font-semibold">Page non trouvée</div>

				<span>Cette page ne semble pas exister</span>
				<Link href="/" className="text-primary-hover">
					Revenir au tableau de bord
				</Link>
			</div>
		</>
	);
}
