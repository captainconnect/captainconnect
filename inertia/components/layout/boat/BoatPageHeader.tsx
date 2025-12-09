import { Link } from "@inertiajs/react";
import { Edit, Wrench } from "lucide-react";
import type { Boat } from "#types/boat";
import type { Intervention } from "#types/intervention";
import BackButton from "~/components/ui/buttons/BackButton";
import Button from "~/components/ui/buttons/Button";

type BoatPageHeaderProps = {
	boat: Boat;
	inProgressInterventions: Intervention[];
};

export default function BoatPageHeader({
	boat,
	inProgressInterventions,
}: BoatPageHeaderProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
			<div className="flex flex-col md:flex-row md:items-center gap-4">
				<BackButton route="/bateaux" />
				<div className="flex flex-col m-2 md:m-0 justify-around md:block">
					<p className="text-2xl font-bold">{boat.name}</p>
					<p className="text-slate-500">
						{boat.interventions?.length
							? `${boat.interventions.length} intervention${boat.interventions.length > 1 ? "s" : ""}`
							: "Aucune intervention"}
					</p>
				</div>
				{inProgressInterventions.length !== 0 && (
					<Link
						title="Accéder à la dernière intervention en cours"
						href={`/interventions/${inProgressInterventions[0].slug}`}
						className="justify-center flex font-semibold px-2 gap-2 items-center text-white p-1 text-sm rounded-full bg-primary hover:bg-primary-hover transition"
					>
						<Wrench size="18" /> En intervention
					</Link>
				)}
			</div>
			<Button icon={<Edit size="18" />} href={`/bateaux/${boat.slug}/modifier`}>
				Modifier
			</Button>
		</div>
	);
}
