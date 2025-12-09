import Role from "#models/role";

export class RoleService {
	async getAll() {
		return await Role.query().orderBy("id", "asc");
	}
}
