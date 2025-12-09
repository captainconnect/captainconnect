import { Sailboat, Ship } from "lucide-react";
import IconBadge from "./IconBadge";

type BoatBadgeProps = {
	type?: string | null;
};

export default function BoatBadge({ type }: BoatBadgeProps) {
	return (
		<IconBadge
			icon={
				type === "Voilier" || type === "Catamaran" ? <Sailboat /> : <Ship />
			}
		/>
	);
}
