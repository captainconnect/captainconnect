import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "contacts";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("note").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("note");
		});
	}
}
