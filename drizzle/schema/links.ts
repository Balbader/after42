import { sql } from 'drizzle-orm';
import { users } from './users';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: uuid('user_id').references(() => users.id),
	githubUrl: text('github_url').notNull().default(''),
	linkedinUrl: text('linkedin_url').notNull().default(''),
	portfolioUrl: text('portfolio_url').notNull().default(''),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`current_timestamp`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`current_timestamp`),
});
