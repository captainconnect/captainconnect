import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Role from "#models/role";

export default class extends BaseSeeder {
	public static environment: string[] = [
		"development",
		"testing",
		"production",
	];
	async run() {
		await Role.createMany([
			{
				slug: "user",
				name: "Utilisateur",
			},
			{
				slug: "admin",
				name: "Administrateur",
			},
		]);
	}
}
