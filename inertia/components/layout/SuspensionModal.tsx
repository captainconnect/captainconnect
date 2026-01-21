import { router } from "@inertiajs/react";
import { Pause, Play } from "lucide-react";
import { useEffect } from "react";
import AdminChecker from "../features/AdminChecker";
import Button from "../ui/buttons/Button";
import Section from "../ui/Section";

type SuspensionScope = "intervention" | "task";

type SuspensionModalProps = {
	open: boolean;
	scope: SuspensionScope;
	reason: string;
	interventionSlug: string;
	taskId?: number;
	href: string;
};

export default function SuspensionModal({
	open,
	reason,
	scope,
	interventionSlug,
	taskId,
	href,
}: SuspensionModalProps) {
	useEffect(() => {
		if (!open) return;

		const main = document.getElementById("app-main");
		if (!main) return;

		// lock
		const prevOverflow = main.style.overflow;
		main.style.overflow = "hidden";

		// unlock
		return () => {
			main.style.overflow = prevOverflow;
		};
	}, [open]);

	if (!open) return null;

	const handleResume = () => {
		if (scope === "intervention") {
			router.patch(`/interventions/${interventionSlug}/resume`);
		} else {
			router.patch(`/tasks/${taskId}/resume`);
		}
	};

	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
			<Section
				className="w-lg"
				title={`${scope === "intervention" ? "Intervention" : "Tâche"} suspendue`}
				icon={<Pause />}
			>
				<div className="flex flex-col gap-4">
					<p className="text-lg">
						Raison : <br />
						<span className="font-semibold">{reason}</span>
					</p>
					<Button href={href}>Retour</Button>
					<AdminChecker mustBeAdmin={true}>
						<Button
							variant="secondary"
							onClick={handleResume}
							icon={<Play size="20" />}
						>
							{`Reprendre ${scope === "intervention" ? "l'intervention" : "la tâche"}`}
						</Button>
					</AdminChecker>{" "}
				</div>
			</Section>
		</div>
	);
}
