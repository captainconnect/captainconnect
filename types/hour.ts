export type DayHours = {
	date: string;
	count: number;
};

export type BoatHours = {
	boat: string;
	hours: DayHours[];
};

export type GroupedByBoat = Record<string, DayHours[]>;
