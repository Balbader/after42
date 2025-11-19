import { sql } from "drizzle-orm";
import { integer, pgTable } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable('jobs', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	companyId: uuid('company_id').references(() => companies.id).notNull(),
	jobTitle: text('job_title').notNull(),
	jobDescription: text('job_description').notNull().default(''),
	jobLocation: text('job_location').notNull().default(''),
	jobType: text('job_type').notNull().default(''),
	jobCategory: text('job_category').notNull().default(''),
	jobSalary: integer('job_salary').notNull().default(0),
	jobPostedAt: timestamp('job_posted_at').notNull().default(sql`current_timestamp`),
	jobUpdatedAt: timestamp('job_updated_at').notNull().default(sql`current_timestamp`),
});
