import User from "#models/user";
import type { UpdateProfilePayload } from "#types/user";

export class ProfileService {
	async update(id: number, payload: UpdateProfilePayload) {
		const user = await User.findOrFail(id);
		user.merge(payload);
		await user.save();
	}
}
