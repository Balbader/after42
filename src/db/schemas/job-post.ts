import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Stores structured job posting data extracted from uploaded files.
 * This is the intermediate format before challenge generation.
 */
export const jobPost = sqliteTable('job_post', {
  id: text('id').primaryKey(),

  // Recruiter who uploaded this
  recruiterId: text('recruiter_id').notNull(),

  // Basic job info
  title: text('title').notNull(),
  company: text('company').notNull(),
  description: text('description').notNull(),

  // Location
  location: text('location'),
  remote: integer('remote', { mode: 'boolean' }).default(false),

  // Job details
  type: text('type').notNull(), // 'full-time', 'part-time', 'contract', 'internship'
  experienceLevel: text('experience_level').notNull(), // 'junior', 'mid', 'senior', 'lead'

  // Skills (stored as JSON arrays)
  requiredSkills: text('required_skills', { mode: 'json' }).$type<string[]>().notNull(),
  niceToHaveSkills: text('nice_to_have_skills', { mode: 'json' }).$type<string[]>().default([]),

  // Responsibilities (stored as JSON array)
  responsibilities: text('responsibilities', { mode: 'json' }).$type<string[]>().default([]),

  // Salary (optional)
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryCurrency: text('salary_currency'),

  // Metadata
  originalFileName: text('original_file_name').notNull(),
  originalFileType: text('original_file_type').notNull(),
  processingStatus: text('processing_status').notNull().default('completed'), // 'processing', 'completed', 'failed'

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
