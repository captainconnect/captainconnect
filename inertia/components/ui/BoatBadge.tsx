import { Fish, Sailboat, Ship, ShipWheel, Waves } from "lucide-react";
import type { JSX } from "react";
import IconBadge from "./IconBadge";

export type BoatType =
	| "Voilier"
	| "Catamaran"
	| "Trimaran"
	| "Goélette"
	| "Voilier de course"
	| "Catamaran de croisière"
	| "Yacht"
	| "Vedette"
	| "Runabout"
	| "Bateau à moteur"
	| "Hors-bord"
	| "Semi-rigide"
	| "Bateau de pêche"
	| "Chalutier"
	| "Troller"
	| "Jet-ski"
	| "Péniche";

export const boatTypeIconMap: Record<BoatType, JSX.Element> = {
	Voilier: <Sailboat />,
	Catamaran: <Sailboat />,
	Trimaran: <Sailboat />,
	Goélette: <Sailboat />,
	"Voilier de course": <Sailboat />,
	"Catamaran de croisière": <Sailboat />,

	Yacht: <Ship />,
	Vedette: <Ship />,
	Runabout: <Ship />,

	"Bateau à moteur": <Ship />,
	"Hors-bord": <Ship />,
	"Semi-rigide": <Ship />,

	"Bateau de pêche": <Fish />,
	Chalutier: <Fish />,
	Troller: <Fish />,

	"Jet-ski": <Waves />,

	Péniche: <ShipWheel />,
};

type BoatBadgeProps = {
	type?: BoatType | null;
};

export default function BoatBadge({ type }: BoatBadgeProps) {
	const icon = type ? boatTypeIconMap[type] : null;

	return <IconBadge icon={icon ?? <Ship />} />;
}
