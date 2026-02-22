import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const challenge = sqliteTable('challenge', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  seniority_level: text('seniority_level').notNull(),
  tech_stack: text('tech_stack').notNull(),
  location_country: text('location_country').notNull(),
  location_city: text('location_city').notNull(),
  remote: integer('remote', { mode: 'boolean' }).notNull().default(false),
  job_type: text('job_type').notNull(),
  salary_range_min: integer('salary_range_min').notNull(),
  salary_range_max: integer('salary_range_max').notNull(),
  currency: text('currency').notNull(),
  equity: integer('yes_no', { mode: 'boolean' }).notNull().default(false),
  description: text('description').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
