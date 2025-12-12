/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from "@adonisjs/core/services/app";
import router from "@adonisjs/core/services/router";
import HoursController from "#controllers/hours_controller";
import { middleware } from "./kernel.js";

const InterventionsController = () =>
	import("#controllers/interventions_controller");
const BoatsController = () => import("#controllers/boats_controller");
const ContactsController = () => import("#controllers/contacts_controller");
const UsersController = () => import("#controllers/users_controller");
const ProfilesController = () => import("#controllers/profiles_controller");
const SessionController = () => import("#controllers/session_controller");
const TasksController = () => import("#controllers/tasks_controller");

if (app.inDev) {
	router.on("/404").renderInertia("errors/not_found");
	router.on("/500").renderInertia("errors/server_error");
}

// --- Authentication Routes ---
router
	.group(() => {
		router
			.get("/nouveau-mot-de-passe", [SessionController, "edit"])
			.as("session.edit");
		router
			.patch("/update-password", [SessionController, "update"])
			.as("session.update");

		router
			.delete("/logout", [SessionController, "destroy"])
			.as("session.destroy");
	})
	.use(middleware.auth());

// --- Guest Routes ---
router
	.group(() => {
		router.get("/connexion", [SessionController, "show"]).as("session.show");
		router
			.post("/authenticate", [SessionController, "store"])
			.as("session.store");
	})
	.use(middleware.guest());

// --- Authenticated App Routes ---
router
	.group(() => {
		router.on("/").renderInertia("home");
		router.on("/version").renderInertia("version");

		router
			.group(() => {
				router.get("/", [ProfilesController, "show"]).as("profile.show");
				router
					.patch("/", [ProfilesController, "updateProfile"])
					.as("profile.update");
				router
					.patch("/password", [ProfilesController, "updatePassword"])
					.as("profile.updatePassword");
			})
			.prefix("/profile");

		// --- Contacts Routes ---
		router
			.group(() => {
				router.get("/", [ContactsController, "index"]).as("contacts.index");
				router
					.post("/store", [ContactsController, "store"])
					.as("contacts.store");
				router
					.put("/update/:contactId", [ContactsController, "update"])
					.as("contacts.update");
				router
					.delete("/destroy/:contactId", [ContactsController, "destroy"])
					.as("contacts.destroy");
			})
			.prefix("contacts");

		// --- Users Routes ---
		router
			.group(() => {
				router.get("/", [UsersController, "index"]).as("users.index");
				router.post("/store", [UsersController, "store"]).as("users.store");
				router.get("/:userId", [UsersController, "show"]).as("users.show");
				router
					.delete("/:userId", [UsersController, "destroy"])
					.as("users.destroy");
				router
					.patch("/:userId/reset-password", [UsersController, "resetPassword"])
					.as("users.reset-password");
				router
					.patch("/:userId/deactivate", [UsersController, "deactivate"])
					.as("users.deactivate");
				router
					.patch("/:userId/activate", [UsersController, "activate"])
					.as("users.activate");

				router
					.patch("/:userId/promote", [UsersController, "promote"])
					.as("users.promote");
				router
					.patch("/:userId/demote", [UsersController, "demote"])
					.as("users.demote");
			})
			.prefix("utilisateurs");

		// --- Boats Routes ---
		router
			.group(() => {
				router.get("/", [BoatsController, "index"]).as("boats.index");
				router.get("nouveau", [BoatsController, "create"]).as("boats.create");
				router.post("nouveau", [BoatsController, "store"]).as("boats.store");
				router.get("/:boatSlug", [BoatsController, "show"]).as("boats.show");
				router
					.get("/:boatSlug/modifier", [BoatsController, "edit"])
					.as("boats.edit");
				router
					.put("/:boatSlug", [BoatsController, "update"])
					.as("boats.update");
				router
					.delete("/:boatSlug", [BoatsController, "destroy"])
					.as("boats.destroy");
			})
			.prefix("bateaux");

		// --- Interventions routes ---
		router
			.group(() => {
				router
					.get("/", [InterventionsController, "index"])
					.as("interventions.index");
				router
					.get("/:interventionSlug", [InterventionsController, "show"])
					.as("interventions.show");
				router
					.get("/nouvelle/:boatSlug", [InterventionsController, "create"])
					.as("interventions.create");
				router
					.post("nouvelle/:boatSlug", [InterventionsController, "store"])
					.as("interventions.store");

				router
					.get("/:interventionSlug/modifier", [InterventionsController, "edit"])
					.as("interventions.edit");
				router
					.put("/:interventionSlug/modifier", [
						InterventionsController,
						"update",
					])
					.as("interventions.update");

				router
					.patch("/:interventionSlug/close", [InterventionsController, "close"])
					.as("interventions.close");
				router
					.patch("/:interventionSlug/suspend", [
						InterventionsController,
						"suspend",
					])
					.as("interventions.suspend");
				router
					.patch("/:interventionSlug/resume", [
						InterventionsController,
						"resume",
					])
					.as("interventions.resume");
				router
					.delete("/:interventionSlug", [InterventionsController, "destroy"])
					.as("interventions.destroy");

				router
					.get("/:interventionSlug/task/:taskId", [TasksController, "show"])
					.as("tasks.show");
				router
					.post("/:interventionSlug/task", [TasksController, "store"])
					.as("tasks.store");

				router
					.get("/:interventionSlug/taches", [TasksController, "index"])
					.as("interventions.tasks.index");
			})
			.prefix("interventions");

		// --- Task routes ---
		router
			.group(() => {
				router
					.patch("/:taskId/check", [TasksController, "checkTask"])
					.as("tasks.check");
				router
					.patch("/:taskId/uncheck", [TasksController, "uncheckTask"])
					.as("tasks.uncheck");

				router
					.post("/:taskId/hour", [TasksController, "addHour"])
					.as("tasks.addHour");
				router
					.patch("/:taskId/details", [TasksController, "updateDetails"])
					.as("tasks.updateDetails");
				router
					.delete("/hour/:hourId", [TasksController, "destroyHour"])
					.as("tasks.hour.destroy");
				router
					.delete("/:interventionSlug/:taskId", [TasksController, "destroy"])
					.as("tasks.destroy");
			})
			.prefix("tasks");

		router
			.group(() => {
				router
					.get("/user/:userId", [HoursController, "getUserHours"])
					.as("hours.user");
			})
			.prefix("hours");
	})
	.use(middleware.auth());
