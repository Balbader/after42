import {
  pgEnum,
  pgTable as table,
  uuid,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const Role = pgEnum('role', [
  'admin',
  'engineer',
  'investor',
  'founder',
]);

export const users = table('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: Role('role').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
