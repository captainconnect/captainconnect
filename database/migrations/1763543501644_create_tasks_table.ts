import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "tasks";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("task_group_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("task_groups")
				.onDelete("CASCADE");
			table.string("name");
			table.string("status", 15).defaultTo("IN_PROGRESS");
			table.string("details").nullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
