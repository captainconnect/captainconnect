import Hour from "#models/hour";
import WorkDone from "#models/work_done";
import type { CreateWorkDonePayload } from "#types/workdone";

export class WorkDoneService {
	async create(
		interventionId: number,
		taskId: number,
		payload: CreateWorkDonePayload,
	) {
		const work_done = await WorkDone.create({
			interventionId,
			taskId,
			date: payload.date,
			workDone: payload.work_done,
			usedMaterials: payload.used_materials || null,
		});

		await Hour.createMany(
			payload.technician_ids.map((id) => {
				return {
					userId: id,
					taskId,
					count: payload.hour_count,
					workDoneId: work_done.id,
				};
			}),
		);
	}
}
