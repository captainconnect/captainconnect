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
import { middleware } from "./kernel.js";

const InterventionsController = () =>
	import("#controllers/interventions_controller");
const BoatsController = () => import("#controllers/boats_controller");
const ContactsController = () => import("#controllers/contacts_controller");
const HoursController = () => import("#controllers/hours_controller");
const UsersController = () => import("#controllers/users_controller");
const MediaController = () => import("#controllers/media_controller");
const ProfilesController = () => import("#controllers/profiles_controller");
const SessionController = () => import("#controllers/session_controller");
const TasksController = () => import("#controllers/tasks_controller");
const WorkDonesController = () => import("#controllers/work_dones_controller");

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

				router
					.patch("/avatar", [ProfilesController, "uploadAvatar"])
					.as("profile.uploadAvatar");
				router
					.delete("/avatar", [ProfilesController, "deleteAvatar"])
					.as("profile.deleteAvatar");
			})
			.prefix("/profile");

		// --- Contacts Routes ---
		router
			.group(() => {
				router.get("/", [ContactsController, "index"]).as("contacts.index");
				router
					.post("/store", [ContactsController, "store"])
					.as("contacts.store")
					.use(middleware.admin());
				router
					.put("/update/:contactId", [ContactsController, "update"])
					.as("contacts.update")
					.use(middleware.admin());
				router
					.delete("/destroy/:contactId", [ContactsController, "destroy"])
					.as("contacts.destroy")
					.use(middleware.admin());
			})
			.prefix("contacts");

		// --- Users Routes ---
		router
			.group(() => {
				router.get("/", [UsersController, "index"]).as("users.index");
				router
					.post("/store", [UsersController, "store"])
					.as("users.store")
					.use(middleware.admin());
				router.get("/:userId", [UsersController, "show"]).as("users.show");
				router
					.delete("/:userId", [UsersController, "destroy"])
					.as("users.destroy")
					.use(middleware.admin());
				router
					.patch("/:userId/reset-password", [UsersController, "resetPassword"])
					.as("users.reset-password")
					.use(middleware.admin());
				router
					.patch("/:userId/deactivate", [UsersController, "deactivate"])
					.as("users.deactivate")
					.use(middleware.admin());
				router
					.patch("/:userId/activate", [UsersController, "activate"])
					.as("users.activate")
					.use(middleware.admin());

				router
					.patch("/:userId/promote", [UsersController, "promote"])
					.as("users.promote")
					.use(middleware.admin());
				router
					.patch("/:userId/demote", [UsersController, "demote"])
					.as("users.demote")
					.use(middleware.admin());
			})
			.prefix("utilisateurs");

		// --- Boats Routes ---
		router
			.group(() => {
				router.get("/", [BoatsController, "index"]).as("boats.index");
				router
					.get("nouveau", [BoatsController, "create"])
					.as("boats.create")
					.use(middleware.admin());
				router
					.post("nouveau", [BoatsController, "store"])
					.as("boats.store")
					.use(middleware.admin());
				router.get("/:boatSlug", [BoatsController, "show"]).as("boats.show");
				router
					.get("/:boatSlug/modifier", [BoatsController, "edit"])
					.as("boats.edit")
					.use(middleware.admin());
				router
					.put("/:boatSlug", [BoatsController, "update"])
					.as("boats.update")
					.use(middleware.admin());
				router
					.delete("/:boatSlug", [BoatsController, "destroy"])
					.as("boats.destroy")
					.use(middleware.admin());
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
					.as("interventions.create")
					.use(middleware.admin());
				router
					.post("nouvelle/:boatSlug", [InterventionsController, "store"])
					.as("interventions.store")
					.use(middleware.admin());

				router
					.get("/:interventionSlug/modifier", [InterventionsController, "edit"])
					.as("interventions.edit")
					.use(middleware.admin());
				router
					.put("/:interventionSlug/modifier", [
						InterventionsController,
						"update",
					])
					.as("interventions.update")
					.use(middleware.admin());

				router
					.patch("/:interventionSlug/close", [InterventionsController, "close"])
					.as("interventions.close")
					.use(middleware.admin());
				router
					.patch("/:interventionSlug/suspend", [
						InterventionsController,
						"suspend",
					])
					.as("interventions.suspend")
					.use(middleware.admin());
				router
					.patch("/:interventionSlug/resume", [
						InterventionsController,
						"resume",
					])
					.as("interventions.resume")
					.use(middleware.admin());
				router
					.delete("/:interventionSlug", [InterventionsController, "destroy"])
					.as("interventions.destroy")
					.use(middleware.admin());

				router
					.get("/:interventionSlug/taches/:taskId", [TasksController, "show"])
					.as("tasks.show");
				router
					.post("/:interventionSlug/task", [TasksController, "store"])
					.as("tasks.store")
					.use(middleware.admin());

				router
					.get("/:interventionSlug/taches", [TasksController, "index"])
					.as("interventions.tasks.index");
				router
					.put("/:interventionSlug/tasks/ordering", [TasksController, "order"])
					.as("interventions.tasks.ordering")
					.use(middleware.admin());
				router
					.post("/:interventionSlug/task/:taskId/store", [
						WorkDonesController,
						"store",
					])
					.as("work_dones.store");
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

				// router
				// 	.post("/:taskId/hour", [TasksController, "addHour"])
				// 	.as("tasks.addHour");
				// router
				// 	.patch("/:taskId/details", [TasksController, "updateDetails"])
				// 	.as("tasks.updateDetails");
				// router
				// 	.delete("/hour/:hourId", [TasksController, "destroyHour"])
				// 	.as("tasks.hour.destroy");
				router
					.patch("/:interventionSlug/:taskId", [TasksController, "update"])
					.as("tasks.update")
					.use(middleware.admin());
				router
					.delete("/:interventionSlug/:taskId", [TasksController, "destroy"])
					.as("tasks.destroy")
					.use(middleware.admin());
			})
			.prefix("tasks");

		router
			.group(() => {
				router
					.get("/user/:userId", [HoursController, "getUserHours"])
					.as("hours.user");
			})
			.prefix("hours");

		router
			.group(() => {
				router
					.post("/projectMedia", [MediaController, "storeProjectMedia"])
					.as("projectMedia.store");
				router
					.post("/projectMedia/mass", [
						MediaController,
						"storeMassProjectMedia",
					])
					.as("projectMedia.massStore");
				router
					.delete("/:projectMediaId", [MediaController, "deleteProjectMedia"])
					.as("projectMedia.delete")
					.use(middleware.admin());
				router
					.delete("/projectMedia/mass", [
						MediaController,
						"deleteManyProjectMedia",
					])
					.as("projectMedia.massDelete")
					.use(middleware.admin());
			})
			.prefix("media");

		router
			.group(() => {
				router.get("/", [MediaController, "index"]).as("medias.index");
				router.get("/:boatSlug", [MediaController, "show"]).as("medias.show");
			})
			.prefix("fichiers");
	})
	.use(middleware.auth());
