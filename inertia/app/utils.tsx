import { Container, Fish, Sailboat, Ship, Waves } from "lucide-react";

export const slugify = (str: string) => {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9]/g, ".")
		.replace(/\.+/g, ".")
		.replace(/^\./, "")
		.replace(/\.$/, "")
		.toLowerCase();
};

const boatTypeIconMap = {
	Voilier: <Sailboat />,
	Catamaran: <Sailboat />,
	Yacht: <Ship />,
	"Bateau à moteur": <Ship />,
	"Hors-bord": <Ship />,
	"Semi-rigide": <Ship />,
	Troller: <Fish />,
	"Jet-ski": <Waves />,
	Péniche: <Container />,
	"Bateau de pêche": <Fish />,
	Trimaran: <Sailboat />,
	Goélette: <Sailboat />,
	Chalutier: <Fish />,
	Vedette: <Ship />,
	Runabout: <Ship />,
	"Voilier de course": <Sailboat />,
	"Catamaran de croisière": <Sailboat />,
} as const;

type BoatTypeLabel = keyof typeof boatTypeIconMap;

export function getBoatTypeIcon(label?: string | null) {
	if (!label) return null;
	if (label in boatTypeIconMap) {
		return boatTypeIconMap[label as BoatTypeLabel];
	}
	return <Ship />; // fallback si label inconnu
}

export const getDefaultDate = () => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
		2,
		"0",
	)}-${String(d.getDate()).padStart(2, "0")}`;
};

export const frDateToInputDate = (date: string): string => {
	const [d, m, y] = date.split("/");
	return `${y}-${m}-${d}`;
};
