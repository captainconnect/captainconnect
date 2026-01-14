import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "tasks";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("suspension_reason").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("suspension_reason");
		});
	}
}
