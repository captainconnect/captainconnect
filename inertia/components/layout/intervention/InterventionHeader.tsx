import { Edit, Wrench } from "lucide-react";
import type { Intervention } from "#types/intervention";
import BackButton from "~/components/ui/buttons/BackButton";
import Button from "~/components/ui/buttons/Button";
import IconBadge from "~/components/ui/IconBadge";

type InterventionHeaderProps = {
	intervention: Intervention;
};

export default function InterventionHeader({
	intervention,
}: InterventionHeaderProps) {
	const boat = intervention.boat;
	return (
		<div className="flex flex-col md:flex-row justify-between items-center">
			<div className="flex w-full flex-col md:flex-row md:items-center gap-4">
				<BackButton route="/interventions" />
				<div className="flex gap-4 items-center">
					<IconBadge icon={<Wrench />} />
					<div className="flex flex-col m-2 md:m-0 justify-around md:block">
						<p className="text-3xl font-bold">{boat.name}</p>
						<p className="text-slate-500">{intervention.title}</p>
					</div>
				</div>
			</div>
			<Button
				className="w-full md:w-auto"
				icon={<Edit size="18" />}
				href={`/interventions/${intervention.slug}/modifier`}
			>
				Modifier
			</Button>
		</div>
	);
}
