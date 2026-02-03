import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "push_subscriptions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table.text("endpoint").notNullable();
			table.text("p256dh").notNullable();
			table.text("auth").notNullable();
			table.text("user_agent");

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
