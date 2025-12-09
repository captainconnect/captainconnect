import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").notNullable();
			table.string("username", 50).notNullable().unique();
			table.string("firstname", 50).nullable();
			table.string("lastname", 50).nullable();
			table.string("phone", 15).nullable().unique();
			table.string("email", 254).nullable().unique();
			table.string("password").notNullable();
			table.boolean("first_login").notNullable().defaultTo(true);
			table.boolean("activated").notNullable().defaultTo(true);
			table
				.integer("role_id")
				.unsigned()
				.references("id")
				.inTable("roles")
				.notNullable()
				.defaultTo(1);

			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").nullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
