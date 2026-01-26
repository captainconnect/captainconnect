import { BaseSeeder } from "@adonisjs/lucid/seeders";
import BoatConstructor from "#models/boat_constructor";
import BoatType from "#models/boat_type";

export default class extends BaseSeeder {
	public static environment: string[] = [
		"development",
		"testing",
		"production",
	];

	async run() {
		await BoatType.createMany([
			{ label: "Voilier" },
			{ label: "Catamaran" },
			{ label: "Yacht" },
			{ label: "Bateau à moteur" },
			{ label: "Hors-bord" },
			{ label: "Semi-rigide" },
			{ label: "Troller" },
			{ label: "Jet-ski" },
			{ label: "Péniche" },
			{ label: "Bateau de pêche" },
			{ label: "Trimaran" },
			{ label: "Goélette" },
			{ label: "Chalutier" },
			{ label: "Vedette" },
			{ label: "Runabout" },
			{ label: "Voilier de course" },
			{ label: "Catamaran de croisière" },
			{ label: "Autre" },
		]);

		await BoatConstructor.createMany([
			{ name: "Beneteau" },
			{ name: "Jeanneau" },
			{ name: "Dufour" },
			{ name: "Bavaria" },
			{ name: "Hanse" },
			{ name: "Dehler" },
			{ name: "Grand Soleil" },
			{ name: "RM Yachts" },
			{ name: "J Boats" },
			{ name: "Elan" },
			{ name: "Nautor's Swan" },

			// Catamarans
			{ name: "Lagoon" },
			{ name: "Fountaine Pajot" },
			{ name: "Leopard Catamarans" },
			{ name: "Nautitech" },
			{ name: "Bali Catamarans" },

			// Yachts et luxe
			{ name: "Azimut" },
			{ name: "Cranchi" },
			{ name: "Ferretti" },
			{ name: "Sunseeker" },
			{ name: "Princess Yachts" },
			{ name: "Prestige" },
			{ name: "Monte Carlo Yachts" },
			{ name: "Fairline" },
			{ name: "Pershing" },
			{ name: "Riva" },
			{ name: "Sanlorenzo" },

			// Bateaux à moteur et semi-rigides
			{ name: "Zodiac" },
			{ name: "Capelli" },
			{ name: "Saver" },
			{ name: "Quicksilver" },
			{ name: "Bayliner" },
			{ name: "Boston Whaler" },
			{ name: "Parker" },
			{ name: "Merry Fisher" },
			{ name: "Sessa Marine" },
			{ name: "Galeon" },

			// Hors-bord & Jet-skis
			{ name: "Yamaha" },
			{ name: "Sea-Doo" },
			{ name: "Kawasaki" },
			{ name: "Suzuki Marine" },
			{ name: "Mercury" },
			{ name: "Honda Marine" },
		]);
	}
}
