import { Link } from "@inertiajs/react";
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
					{boat.thumbnailUrl ? (
						<a href={boat.thumbnailUrl} target="_blank">
							<img
								className="size-14 rounded-xl"
								src={boat.thumbnailUrl}
								alt="Thumbnail du bateau"
							/>
						</a>
					) : (
						<IconBadge icon={<Wrench />} />
					)}

					<div className="flex flex-col m-2 md:m-0 justify-around md:block">
						<Link href={`/bateaux/${boat.slug}`} className="text-3xl font-bold">
							{boat.name}
						</Link>
						<p className="text-slate-500">{intervention.title}</p>
					</div>
				</div>
			</div>
			<div className="flex gap-4">
				<Button
					mustBeAdmin={true}
					className="w-full md:w-auto"
					icon={<Edit size="18" />}
					href={`/interventions/${intervention.slug}/modifier`}
				>
					Modifier
				</Button>
				<a
					href={`/interventions/${intervention.slug}/pdf`}
					rel="noopener"
					target="_blank"
					className="flex items-center justify-center gap-2 font-semibold rounded-2xl border-2 transition active:scale-95 cursor-pointer text-sm max-h-10 disabled:bg-gray-300 disabled:border-transparent disabled:text-gray-500 disabled:active:scale-100 px-4 py-2 sm:px-5 bg-primary border-transparent text-white hover:bg-primary-hover w-full md:w-auto"
				>
					PDF
				</a>
			</div>
		</div>
	);
}
