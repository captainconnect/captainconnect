import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "boats";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");
			table.string("name", 100).notNullable();
			table.string("slug");
			table
				.integer("contact_id")
				.nullable()
				.unsigned()
				.references("id")
				.inTable("contacts")
				.onDelete("SET NULL");
			table
				.integer("boat_type_id")
				.nullable()
				.unsigned()
				.references("id")
				.inTable("boat_types")
				.onDelete("RESTRICT");
			table
				.integer("boat_constructor_id")
				.nullable()
				.unsigned()
				.references("id")
				.inTable("boat_constructors")
				.onDelete("RESTRICT");
			table.string("model").nullable();
			table.string("place").nullable();
			table.json("position").nullable();
			table.string("mmsi").nullable();
			table.string("call_sign").nullable();
			table.float("length").nullable();
			table.float("beam").nullable();
			table.text("note").nullable();

			table.timestamp("created_at");
			table.timestamp("updated_at");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
