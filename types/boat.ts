import type { Contact } from "./contact.js";
import type { Intervention } from "./intervention.js";

export type Boat = {
	id: number;
	name: string;
	slug: string;
	contact?: Contact;
	type?: BoatType;
	boatConstructor?: BoatConstructor;
	model?: string;
	place?: string;
	position?: Coordinate;
	mmsi?: string;
	callSign?: string;
	length?: string;
	beam?: string;
	note?: string;
	interventions: Intervention[];
	medias_count?: number;
};

export interface BoatPayload {
	name: string;
	contact_id?: number | null;
	type_id?: number | null;
	constructor_id?: number | null;
	model?: string | null;
	place?: string | null;
	position?: Coordinate | null;
	mmsi?: string | null;
	call_sign?: string | null;
	length?: number | null;
	beam?: number | null;
	note?: string | null;
}

export type BoatType = {
	id: number;
	label: string;
};

export type BoatConstructor = {
	id: number;
	name: string;
};

export type Coordinate = [number, number];
