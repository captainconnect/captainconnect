import { LocateFixed, LocateOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import type { Coordinate } from "#types/boat";
import { MarkerIcon } from "~/app/LeafletMarkerIcon";
import Button from "~/components/ui/buttons/Button";

function ChangeView({ center, zoom }: { center: Coordinate; zoom: number }) {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom, map]);

	return null;
}

type ClickMarkerProps = {
	onChangePosition: (pos: Coordinate) => void;
	position: Coordinate | "";
};

function ClickMarker({ onChangePosition, position }: ClickMarkerProps) {
	useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;
			const coords: Coordinate = [lat, lng];
			onChangePosition(coords);
		},
	});

	return typeof position !== "string" ? (
		<Marker
			icon={MarkerIcon}
			position={position}
			draggable={true}
			eventHandlers={{
				dragend: (e) => {
					const latlng = e.target.getLatLng();
					const coords: Coordinate = [latlng.lat, latlng.lng];
					onChangePosition(coords);
				},
			}}
		/>
	) : null;
}

type ManualSetPositionCardProps = {
	onChange: (pos: Coordinate | "") => void;
	currentPos?: Coordinate | "";
};

export default function ManualSetPositionCard({
	onChange,
	currentPos,
}: ManualSetPositionCardProps) {
	const zoom = 17;
	const portCorbieres: Coordinate = [43.3594946102194, 5.298484362003815];

	if (currentPos === undefined) currentPos = "";

	const [processingGps, setProcessingGps] = useState(false);
	const [shouldRecenter, setShouldRecenter] = useState(false);
	const [markerPosition, setMarkerPosition] = useState<Coordinate | "">(
		currentPos,
	);

	const onPositionSelected = (coords: Coordinate) => {
		setMarkerPosition(coords);
		onChange(coords);
		setShouldRecenter(false);
	};

	const onPositionDelete = () => {
		setMarkerPosition("");
		onChange("");
		setShouldRecenter(true);
	};

	const mapCenter = markerPosition ? markerPosition : portCorbieres;

	const getLocation = () => {
		if (!navigator.geolocation) {
			return alert("La géolocalisation n'est pas supportée sur votre appareil");
		}
		setProcessingGps(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const coords: Coordinate = [pos.coords.latitude, pos.coords.longitude];
				setProcessingGps(false);
				onPositionSelected(coords);

				setShouldRecenter(true);
			},
			(err) => {
				console.error(`Error : ${err.message}`);
				setProcessingGps(false);
			},
			{
				enableHighAccuracy: true,
			},
		);
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Button
					processing={processingGps}
					onClick={getLocation}
					icon={<LocateFixed />}
				>
					Récupérer ma position
				</Button>
				<Button
					variant="secondary"
					onClick={onPositionDelete}
					icon={<LocateOff />}
				>
					Supprimer la position
				</Button>
			</div>

			<div className="w-full h-96 rounded-3xl border border-gray-200">
				<MapContainer
					center={mapCenter}
					zoom={zoom}
					style={{ height: "100%", width: "100%" }}
					className="rounded-xl"
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{shouldRecenter && <ChangeView center={mapCenter} zoom={zoom} />}

					<ClickMarker
						position={markerPosition}
						onChangePosition={onPositionSelected}
					/>
				</MapContainer>
			</div>
		</div>
	);
}
