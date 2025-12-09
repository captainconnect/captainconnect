import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "contacts";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.string("company").nullable();
			table.string("full_name").notNullable();
			table.string("email").nullable();
			table.string("phone").nullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
