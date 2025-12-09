import { BaseSeeder } from "@adonisjs/lucid/seeders";
import User from "#models/user";

export default class extends BaseSeeder {
	public static environment: string[] = [
		"development",
		"testing",
		"production",
	];

	async run() {
		await User.createMany([
			{
				username: "dany.petit",
				firstname: "Dany",
				lastname: "Petit",
				password: "danypetit",
				roleId: 2,
			},
			{
				username: "clement.mistral",
				firstname: "Clément",
				lastname: "Mistral",
				password: "clementmistral",
				roleId: 2,
			},
		]);
	}
}
