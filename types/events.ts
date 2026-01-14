import type Media from "#models/media";

declare module "@adonisjs/core/types" {
	interface EventsList {
		"boat:deleted": string;
		"user:deleted": Media;
	}
}
