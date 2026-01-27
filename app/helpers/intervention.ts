import { DateTime } from "luxon";
import type Hour from "#models/hour";
import type User from "#models/user";

export function formatDate(d: Date | string) {
	const js = d instanceof Date ? d : new Date(d);
	return DateTime.fromJSDate(js).setLocale("fr").toFormat("dd/LL/yyyy");
}

export function getInitials(u: User) {
	const first = u.firstname?.trim();
	const last = u.lastname?.trim();

	if (!first || !last) return "?";

	return `${first[0]}${last[0]}`.toUpperCase();
}

export function formatHours(hours: Hour[] = []) {
	if (!hours.length) return "-";

	// somme des heures décimales (step 0.25)
	const total = hours.reduce((acc, h) => acc + Number(h.count ?? 0), 0);

	if (!total) return "-";

	const h = Math.floor(total);
	const decimal = +(total - h).toFixed(2);

	const minutesMap: Record<number, number> = {
		0: 0,
		0.25: 15,
		0.5: 30,
		0.75: 45,
	};

	const minutes = minutesMap[decimal] ?? Math.round(decimal * 60);

	return minutes === 0 ? `${h}h` : `${h}h${String(minutes).padStart(2, "0")}`;
}

export function formatDecimalHours(total: number): string {
	if (!total || total <= 0) return "-";

	const h = Math.floor(total);
	// Calcul précis de la partie décimale
	const decimal = Math.round((total - h) * 100) / 100;

	const minutesMap: Record<number, number> = {
		0: 0,
		0.25: 15,
		0.5: 30,
		0.75: 45,
	};

	const minutes =
		minutesMap[decimal] !== undefined
			? minutesMap[decimal]
			: Math.round(decimal * 60);

	return minutes === 0 ? `${h}h` : `${h}h${String(minutes).padStart(2, "0")}`;
}
