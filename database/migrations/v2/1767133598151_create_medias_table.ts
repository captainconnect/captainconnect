import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "medias";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.string("bucket").notNullable();
			table.string("object_key").notNullable();
			table.string("mime_type").notNullable();
			table.string("extension").nullable();
			table.bigInteger("byte_size").unsigned().notNullable();

			table.integer("width").unsigned().nullable();
			table.integer("height").unsigned().nullable();

			table.string("checksum_sha256").notNullable().unique();

			table.string("original_name").notNullable();

			table
				.integer("owner_id")
				.unsigned()
				.references("id")
				.inTable("users")
				.onDelete("SET NULL")
				.nullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
