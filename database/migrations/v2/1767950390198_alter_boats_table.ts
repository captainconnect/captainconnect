import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "boats";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table
				.integer("thumbnail_id")
				.unsigned()
				.nullable()
				.references("id")
				.inTable("medias")
				.onDelete("SET NULL")
				.defaultTo(null);
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("thumbnail_id");
		});
	}
}
