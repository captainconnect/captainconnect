import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "work_dones";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("task_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("tasks")
				.onDelete("CASCADE");
			table
				.integer("intervention_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("interventions")
				.onDelete("CASCADE");
			table.text("work_done").notNullable();
			table.text("used_materials").nullable();
			table.timestamp("date");

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
