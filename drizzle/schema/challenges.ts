import { sql } from 'drizzle-orm';
import { integer, pgTable } from 'drizzle-orm/pg-core';
import { text } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { jobs } from './jobs';
import { companies } from './companies';

export const challenges = pgTable('challenges', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	jobId: uuid('job_id')
		.references(() => jobs.id)
		.notNull(),
	companyId: uuid('company_id')
		.references(() => companies.id)
		.notNull(),
	challengeTitle: text('challenge_title').notNull().default(''),
	challengeDescription: text('challenge_description').notNull().default(''),
	challengeDifficulty: text('challenge_difficulty').notNull().default(''),
	challengeTechStack: text('challenge_tech_stack').notNull().default(''),
	challengeScore: integer('challenge_score').notNull().default(0),
	challengeStatus: text('challenge_status').notNull().default(''),
	challengeCandidateIds: uuid('challenge_candidate_ids')
		.array()
		.notNull()
		.default(sql`ARRAY[]::uuid[]`),
	challengeCreatedAt: timestamp('challenge_created_at')
		.notNull()
		.default(sql`current_timestamp`),
	challengeUpdatedAt: timestamp('challenge_updated_at')
		.notNull()
		.default(sql`current_timestamp`),
});
