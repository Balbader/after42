import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

export const companies = pgTable('companies', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	companyName: text('company_name').notNull(),
	companyDescription: text('company_description').notNull(),
	companyWebsiteUrl: text('company_website_url').notNull(),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`current_timestamp`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`current_timestamp`),
});
