import { BaseSeeder } from "@adonisjs/lucid/seeders";
import User from "#models/user";

export default class extends BaseSeeder {
	public static environment: string[] = ["development", "testing"];
	async run() {
		await User.createMany([
			{
				username: "marc.langlet",
				firstname: "Marc",
				lastname: "Langlet",
				password: "marclanglet",
				roleId: 1,
			},
			{
				username: "yann.bouvier",
				firstname: "Yann",
				lastname: "Bouvier",
				password: "yannbouvier",
				roleId: 1,
			},
			{
				username: "julien.koenig",
				firstname: "Julien",
				lastname: "Koenig",
				password: "julienkoenig",
				roleId: 1,
			},
		]);
	}
}
