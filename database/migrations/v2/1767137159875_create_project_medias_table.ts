import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "project_medias";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table
				.integer("boat_id")
				.unsigned()
				.references("id")
				.inTable("boats")
				.onDelete("CASCADE")
				.notNullable();
			table
				.integer("media_id")
				.unsigned()
				.references("id")
				.inTable("medias")
				.onDelete("CASCADE")
				.notNullable();
			table
				.integer("intervention_id")
				.unsigned()
				.references("id")
				.inTable("interventions")
				.onDelete("SET NULL")
				.nullable();
			table
				.integer("task_id")
				.unsigned()
				.references("id")
				.inTable("tasks")
				.onDelete("SET NULL")
				.nullable();
			table.string("caption").nullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
