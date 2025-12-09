import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "task_groups";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("intervention_id")
				.notNullable()
				.unsigned()
				.references("id")
				.inTable("interventions")
				.onDelete("CASCADE");
			table.string("name");

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
