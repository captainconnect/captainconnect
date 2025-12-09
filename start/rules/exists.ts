import db from "@adonisjs/lucid/services/db";
import vine, { VineNumber, VineString } from "@vinejs/vine";
import type { FieldContext } from "@vinejs/vine/types";

type Options = {
	table: string;
	column: string;
};

async function exists(value: unknown, options: Options, field: FieldContext) {
	if (typeof value !== "string" && typeof value !== "number") return;

	const result = await db
		.from(options.table)
		.select(options.column)
		.where(options.column, value)
		.first();

	if (!result) {
		field.report("Le champs {{ field }} n'existe pas", "exists", field);
	}
}

export const existsRule = vine.createRule(exists);

declare module "@vinejs/vine" {
	interface VineString {
		exists(options: Options): this;
	}
	interface VineNumber {
		exists(options: Options): this;
	}
}

VineString.macro("exists", function (this: VineString, options: Options) {
	return this.use(existsRule(options));
});
VineNumber.macro("exists", function (this: VineNumber, options: Options) {
	return this.use(existsRule(options));
});
