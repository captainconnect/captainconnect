import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "hours";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("user_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table
				.integer("task_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("tasks")
				.onDelete("CASCADE");
			table.timestamp("date");
			table.float("count").notNullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
