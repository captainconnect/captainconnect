import { Link } from "@inertiajs/react";
import { Wrench } from "lucide-react";
import type { Boat } from "#types/boat";
import BoatBadge from "~/components/ui/BoatBadge";

type BoatCardProps = {
	boat: Boat;
};

export default function BoatCard({ boat }: BoatCardProps) {
	return (
		<li>
			<Link
				className="flex flex-col gap-6 bg-white rounded-xl border border-gray-300  p-6 cursor-pointer hover:shadow-sm transition active:scale-[99%]"
				href={`/bateaux/${boat.slug}`}
			>
				<div className="flex justify-between items-center">
					<div className="flex gap-4">
						<BoatBadge type={boat.type?.label} />
						<div>
							<p className="text-lg font-semibold">{boat.name}</p>
							<p className="flex gap-1 text-slate-500">
								{(() => {
									const type = boat.type?.label;
									const brand = boat.boatConstructor?.name;
									const model = boat.model;

									if (!type && !brand && !model) return null;

									let text = "";

									if (type) text += type;

									if (type && (brand || model)) text += " - ";

									if (brand) text += brand + (model ? ` ${model}` : "");
									else if (model) text += model;

									return <span>{text}</span>;
								})()}
							</p>
						</div>
					</div>
					{boat.interventions.length !== 0 && (
						<span className="flex font-semibold px-2 gap-2 items-center text-white p-1 text-sm rounded-full bg-primary">
							<Wrench size="18" />{" "}
							<span className="hidden md:block">Intervention en cours</span>
						</span>
					)}
				</div>
			</Link>
		</li>
	);
}
