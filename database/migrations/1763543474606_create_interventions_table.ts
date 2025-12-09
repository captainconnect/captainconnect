import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "interventions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("boat_id")
				.notNullable()
				.unsigned()
				.references("id")
				.inTable("boats")
				.onDelete("CASCADE");
			table.string("title", 150);
			table.string("slug", 254);
			table.string("description", 254).nullable();
			table.string("status", 15).defaultTo("IN_PROGRESS");
			table.timestamp("start_at").nullable();
			table.timestamp("end_at").nullable();
			table.string("priority", 15).defaultTo("NORMAL");

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
