import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Contact from "#models/contact";

export default class extends BaseSeeder {
	public static environment: string[] = ["development", "testing"];
	async run() {
		await Contact.createMany([
			{
				company: "Phocea Yachting",
				fullName: "Michel Lucas",
				phone: "0684679243",
				email: "michel@phocea-yachting.fr",
			},
			{
				company: "Phocea Yachting",
				fullName: "Marine Lucas",
				phone: "0647249745",
				email: "marine@phocea-yachting.fr",
			},
			{
				company: "Phocea Yachting",
				fullName: "André",
				phone: "0758573982",
			},
			{
				company: "Neptune Solution",
				fullName: "Patrick",
				phone: "0656744555",
			},
			{
				company: "Valkyrie",
				fullName: "Christophe",
				phone: "0654638743",
			},
			{
				fullName: "David",
				phone: "0688461456",
			},
		]);
	}
}
