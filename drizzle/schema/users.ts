import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	username: text('username').notNull().default(''),
	firstname: text('firstname').notNull().default(''),
	lastname: text('lastname').notNull().default(''),
	email: text('email').notNull().unique(),
	role: text('role').notNull().default(''),
	createdAt: timestamp('created_at')
		.notNull()
		.default(sql`current_timestamp`),
	updatedAt: timestamp('updated_at')
		.notNull()
		.default(sql`current_timestamp`),
});
