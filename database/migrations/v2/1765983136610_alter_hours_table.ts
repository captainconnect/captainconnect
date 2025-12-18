import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "hours";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table
				.integer("work_done_id")
				.unsigned()
				.notNullable()
				.references("id")
				.inTable("work_dones")
				.onDelete("CASCADE");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("work_done_id");
		});
	}
}
