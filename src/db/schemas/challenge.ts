import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const challenge = sqliteTable(
	'challenge',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		seniority_level: text('seniority_level').notNull(),
		tech_stack: text('tech_stack').notNull(),
		location_country: text('location_country').notNull(),
		location_city: text('location_city').notNull(),
		remote: integer('remote', { mode: 'boolean' }).notNull().default(false),
		job_type: text('job_type').notNull(),
		/** Primary discipline: frontend, backend, full-stack, etc. (from AI at generation). */
		engineering_category: text('engineering_category').notNull().default('other'),
		salary_range_min: integer('salary_range_min').notNull(),
		salary_range_max: integer('salary_range_max').notNull(),
		currency: text('currency').notNull(),
		equity: integer('yes_no', { mode: 'boolean' }).notNull().default(false),
		description: text('description').notNull(),

		// Link to source job post
		jobPostId: text('job_post_id'),

		// Recruiter who created this challenge
		creatorId: text('creator_id'),

		// AI-generated challenge content (README, starter code, etc.)
		challengeContent: text('challenge_content', { mode: 'json' }).$type<{
			readme: string;
			starterCode?: Record<string, string>;
			evaluationCriteria?: string[];
		}>(),

		// GitHub repo name in after42 org (e.g., "challenge-abc123")
		githubRepoName: text('github_repo_name'),

		// Challenge lifecycle status
		status: text('status').notNull().default('draft'),
		// 'draft' → 'active' → 'closed'

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index('challenge_job_post_idx').on(table.jobPostId),
		index('challenge_creator_idx').on(table.creatorId),
	],
);
