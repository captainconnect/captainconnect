import { getDirname } from "@adonisjs/core/helpers";
import inertia from "@adonisjs/inertia/client";
import adonisjs from "@adonisjs/vite/client";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		inertia({ ssr: { enabled: false } }),
		react(),
		adonisjs({
			entrypoints: ["inertia/app/app.tsx"],
			reload: ["resources/views/**/*.edge"],
		}),
		tailwindcss(),
	],

	resolve: {
		alias: {
			"~/": `${getDirname(import.meta.url)}/inertia/`,
		},
	},

	server: {
		// Autorise les tunnels ngrok / IP locale
		allowedHosts: [
			"localhost",
			".localhost",
			".ngrok.io", // pour ngrok
			".loca.lt", // pour localhost.run
			"plentiful-pretemperate-ninfa.ngrok-free.dev",
		],
	},
});
