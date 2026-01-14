import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps } from "@adonisjs/inertia/types";
import { DriveService } from "#services/drive_service";

const driveService = new DriveService();
const inertiaConfig = defineConfig({
	/**
	 * Path to the Edge view that will be used as the root view for Inertia responses
	 */
	rootView: "inertia_layout",

	/**
	 * Data that should be shared with all rendered pages
	 */
	sharedData: {
		authenticatedUser: (ctx) =>
			ctx.inertia.always(async () => {
				const authUser = ctx.auth.user;

				if (!authUser) return null;

				await authUser.load("role");
				await authUser.load("avatar");
				let url: string | undefined;
				if (authUser.avatar) {
					url = driveService.getUrl(authUser.avatar.objectKey);
				}
				return {
					id: authUser.id,
					firstname: authUser.firstname,
					lastname: authUser.lastname,
					isAdmin: await authUser.isAdmin(),
					role: {
						slug: authUser.role.slug,
						name: authUser.role.name,
					},
					initials:
						authUser.firstname[0].toUpperCase() +
						authUser.lastname[0].toUpperCase(),
					avatar: url || undefined,
				};
			}),
	},

	/**
	 * Options for the server-side rendering
	 */
	ssr: {
		enabled: false,
		entrypoint: "inertia/app/ssr.tsx",
	},
});

export default inertiaConfig;

declare module "@adonisjs/inertia/types" {
	export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
