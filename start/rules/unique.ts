import db from "@adonisjs/lucid/services/db";
import vine, { VineNumber, VineString } from "@vinejs/vine";
import type { FieldContext } from "@vinejs/vine/types";

type Options = {
	table: string;
	column: string;
};

async function isUnique(value: unknown, options: Options, field: FieldContext) {
	if (typeof value !== "string" && typeof value !== "number") return;

	const query = db
		.from(options.table)
		.select(options.column)
		.where(options.column, value);

	if (field.meta?.boat?.id !== undefined) {
		query.whereNot("id", field.meta.boat.id);
	}

	const result = await query.first();

	if (result) field.report("La valeur doit être unique", "isUnique", field);
}

export const isUniqueRule = vine.createRule(isUnique);

declare module "@vinejs/vine" {
	interface VineString {
		isUnique(options: Options): this;
	}
	interface VineNumber {
		isUnique(options: Options): this;
	}
}

VineString.macro("isUnique", function (this: VineString, options: Options) {
	return this.use(isUniqueRule(options));
});

VineNumber.macro("isUnique", function (this: VineNumber, options: Options) {
	return this.use(isUniqueRule(options));
});
