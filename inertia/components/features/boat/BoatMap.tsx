import {
	Circle,
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Boat, Coordinate } from "#types/boat";
import { placesCoordinates } from "~/app/places";

type BoatMapProps = {
	boat: Boat;
};

function SetViewOnLoad({
	center,
	zoom,
}: {
	center: [number, number];
	zoom: number;
}) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

export default function BoatMap({ boat }: BoatMapProps) {
	const zoom = 17;
	const placeNumber = Number(boat.place);

	let isPanne = placeNumber >= 1 && placeNumber <= 9;

	let boatPosition: Coordinate | undefined;

	if (placeNumber in placesCoordinates) {
		boatPosition = placesCoordinates[placeNumber];
	} else {
		const panneNumber = Number(String(placeNumber)[0]);
		isPanne = true;
		boatPosition = placesCoordinates[panneNumber];
	}

	return (
		<div className="w-full h-96 rounded-3xl mt-4">
			<MapContainer
				style={{ height: "100%", width: "100%" }}
				className="rounded-xl"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<SetViewOnLoad center={boatPosition} zoom={zoom} />

				{isPanne ? (
					<Circle
						center={boatPosition}
						radius={50}
						pathOptions={{
							color: "darkblue",
							fillColor: "blue",
							fillOpacity: 0.2,
						}}
					/>
				) : (
					<Marker position={boatPosition}>
						<Popup>
							<b>{boat.name}</b>
							<br />
							Place {placeNumber}
						</Popup>
					</Marker>
				)}
			</MapContainer>
		</div>
	);
}
