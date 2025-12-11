import { LocateFixed } from "lucide-react";
import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents,
} from "react-leaflet";
import type { Coordinate } from "#types/boat";
import Button from "~/components/ui/buttons/Button";
import Loader from "~/components/ui/Loader";

type ClickMarkerProps = {
	onChange: (coords: Coordinate) => void;
	currentPos?: Coordinate;
};

type ManualSetPositionCardProps = {
	onChange: (pos: Coordinate) => void;
	currentPos?: Coordinate;
};

function ChangeView({ center, zoom }: { center: Coordinate; zoom: number }) {
	const map = useMap();

	useEffect(() => {
		map.setView(center, zoom);
	}, [center, zoom, map]);

	return null;
}

function ClickMarker({ onChange, currentPos }: ClickMarkerProps) {
	const [position, setPosition] = useState<Coordinate | null>(
		currentPos ? currentPos : null,
	);

	useEffect(() => {
		if (currentPos) {
			setPosition(currentPos);
		}
	}, [currentPos]);

	useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;
			const coords: Coordinate = [lat, lng];
			setPosition(coords);
			onChange(coords);
		},
	});

	return position ? (
		<Marker
			position={position}
			draggable={true}
			eventHandlers={{
				dragend: (e) => {
					const latlng = e.target.getLatLng();
					const coords: Coordinate = [latlng.lat, latlng.lng];
					setPosition(coords);
					onChange(coords);
				},
			}}
		/>
	) : null;
}

export default function ManualSetPositionCard({
	onChange,
	currentPos,
}: ManualSetPositionCardProps) {
	const zoom = 17;
	const portCorbieres: Coordinate = [43.3594946102194, 5.298484362003815];

	const [processingGps, setProcessingGps] = useState(false);
	const [pos, setPos] = useState<Coordinate | undefined>(currentPos);
	const [shouldRecenter, setShouldRecenter] = useState(false);

	const onPositionSelected = (coords: Coordinate) => {
		setPos(coords);
		onChange(coords);
		setShouldRecenter(false); // Ne pas recentrer sur clic manuel
	};

	const mapCenter = pos ?? portCorbieres;

	const getLocation = () => {
		if (!navigator.geolocation) {
			return alert("La géolocalisation n'est pas supportée sur votre appareil");
		}
		setProcessingGps(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const coords: Coordinate = [pos.coords.latitude, pos.coords.longitude];
				setProcessingGps(false);
				setPos(coords);
				onChange(coords);

				setShouldRecenter(true); // Recentrer uniquement pour le GPS
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
			<Button onClick={getLocation} icon={<LocateFixed />}>
				{processingGps ? <Loader /> : "Récupérer ma position"}
			</Button>

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

					<ClickMarker currentPos={pos} onChange={onPositionSelected} />
				</MapContainer>
			</div>
		</div>
	);
}
