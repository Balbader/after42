import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const userRole = text('user_role', [
  'admin',
  'engineer',
  'investor',
  'founder',
]);

export const user = sqliteTable('user', {
  id: text('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  role: userRole.notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
