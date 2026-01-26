import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import type { Boat, Coordinate } from "#types/boat";
import { SailMarkerIcon, ShipMarkerIcon } from "~/app/LeafletMarkerIcon";
import { placesCoordinates } from "~/app/places";

type BoatMapProps = {
	boat: Boat;
};

export default function BoatMap({ boat }: BoatMapProps) {
	const zoom = 17;
	let boatPosition: Coordinate;
	let isPanne = false;
	let placeNumber = null;
	if (boat.place && !Number.isNaN(Number(boat.place))) {
		placeNumber = Number(boat.place);
		isPanne = placeNumber >= 1 && placeNumber <= 9;
		if (placeNumber in placesCoordinates) {
			boatPosition = placesCoordinates[placeNumber];
		} else {
			const panneNumber = Number(String(placeNumber)[0]);
			isPanne = true;
			boatPosition = placesCoordinates[panneNumber];
		}
	} else {
		boatPosition = boat.position as Coordinate;
	}

	const thumbnailIcon = icon({
		iconUrl: boat.thumbnailUrl ?? "",
		iconSize: [40, 40],
		className: "rounded-full border-2 border-white",
	});

	return (
		<div className="w-full h-96 rounded-3xl mt-4">
			<MapContainer
				style={{ height: "100%", width: "100%" }}
				className="rounded-xl"
				center={boatPosition}
				zoom={zoom}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

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
					<Marker
						icon={
							boat.thumbnailUrl
								? thumbnailIcon
								: boat.type?.label === "Voilier" ||
										boat.type?.label === "Catamaran"
									? SailMarkerIcon
									: ShipMarkerIcon
						}
						position={boatPosition}
					>
						<Popup>
							<b>{boat.name}</b>
							<br />
							{placeNumber && `Place ${placeNumber}`}
							{boat.thumbnailUrl && (
								<img
									className="rounded mt-1"
									src={boat.thumbnailUrl}
									alt="Thumbnail du bateau"
								/>
							)}
						</Popup>
					</Marker>
				)}
			</MapContainer>
		</div>
	);
}
