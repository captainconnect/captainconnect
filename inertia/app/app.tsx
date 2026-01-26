/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import "../css/app.css";
import "../css/global.css";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "react-image-crop/dist/ReactCrop.css";

const appName = "Cap'tain Connect";

createInertiaApp({
	progress: { color: "#0b2641" },

	title: (title) => `${title} - ${appName}`,

	resolve: (name) => {
		return resolvePageComponent(
			`../pages/${name}.tsx`,
			import.meta.glob("../pages/**/*.tsx"),
		);
	},

	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
});
