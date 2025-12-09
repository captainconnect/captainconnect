import { defineConfig, drivers } from "@adonisjs/core/hash";

const hashConfig = defineConfig({
	default: "argon",

	list: {
		argon: drivers.argon2({
			version: 0x13, // Argon2 v1.3
			variant: "id", // Argon2id = recommandé
			iterations: 4, // timeCost : sécurité vs vitesse
			memory: 131072, // 128 MB → bon niveau 2025
			parallelism: 2, // ajuster selon les CPUs
			saltSize: 16,
			hashLength: 32,
		}),
	},
});

export default hashConfig;

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module "@adonisjs/core/types" {
	export interface HashersList extends InferHashers<typeof hashConfig> {}
}
