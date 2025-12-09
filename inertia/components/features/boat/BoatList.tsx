import type { Boat } from "#types/boat";
import BoatCard from "./BoatCard";

type BoatListProps = {
	boats: Boat[];
};

export default function BoatList({ boats }: BoatListProps) {
	return (
		<ul className="flex flex-col gap-4">
			{boats.map((boat) => (
				<BoatCard key={boat.slug} boat={boat} />
			))}
		</ul>
	);
}
