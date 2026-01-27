import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "dashboard_versions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.string("name").notNullable();
			table.text("content").notNullable();
			table.boolean("is_active").defaultTo(false).index();
			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
