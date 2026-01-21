import db from "@adonisjs/lucid/services/db";
import type { GroupedByBoat } from "#types/hour";

export class HourService {
	async getUserHours(id: number, startAt: Date, endAt: Date) {
		return await db
			.from("hours")
			.join("work_dones", "work_dones.id", "hours.work_done_id")
			.join("interventions", "interventions.id", "work_dones.intervention_id")
			.join("boats", "boats.id", "interventions.boat_id")
			.where("hours.user_id", id)
			.whereBetween("work_dones.date", [startAt, endAt])
			.select(
				"boats.name as boat",
				db.raw("DATE(work_dones.date) as day"),
				db.raw("SUM(hours.count) as total_hours"),
			)
			.groupBy("boat", "day")
			.orderBy("boat")
			.orderBy("day");
	}

	async getFormattedUserHours(id: number, startAt: Date, endAt: Date) {
		const rows = await this.getUserHours(id, startAt, endAt);

		const grouped: GroupedByBoat = {};

		for (const r of rows) {
			if (!grouped[r.boat]) {
				grouped[r.boat] = [];
			}

			grouped[r.boat].push({
				date: this.formatDate(r.day),
				count: Number(r.total_hours),
			});
		}

		return Object.entries(grouped).map(([boat, hours]) => ({
			boat,
			hours,
		}));
	}

	// Formatage de date : "21/01/2025"
	private formatDate(date: string) {
		const d = new Date(date);
		return d.toLocaleDateString("fr-FR"); // DD/MM/YYYY
	}
}
