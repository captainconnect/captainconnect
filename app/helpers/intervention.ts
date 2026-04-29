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

	const total = hours.reduce((acc, h) => acc + Number(h.count ?? 0), 0);

	if (!total) return "-";

	return String(Math.round(total * 4) / 4).replace(".", ",");
}

export function formatDecimalHours(total: number): string {
	if (!total || total <= 0) return "-";

	return String(Math.round(total * 4) / 4).replace(".", ",");
}
