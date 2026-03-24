import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Stores candidate code submissions for challenges.
 *
 * BLIND REVIEW: candidateId and githubForkName NEVER appear in company-facing
 * API responses. Company sees only: sequenceNum ("Candidate #3"), score,
 * aiReport, and interviewGuide.
 *
 * recommendation is an enum: 'recommend' | 'consider' | 'pass'
 * interviewGuide stores paired Q+A objects (not parallel arrays)
 */
export const candidateSubmission = sqliteTable(
	'candidate_submission',
	{
		id: text('id').primaryKey(),

		// Foreign keys
		challengeId: text('challenge_id').notNull(),
		candidateId: text('candidate_id').notNull(),

		// Blind review: per-challenge sequence number shown to company
		// Assigned atomically via challenge_counter table
		sequenceNum: integer('sequence_num').notNull(),

		// GitHub fork info (never exposed to company)
		githubForkName: text('github_fork_name').notNull(),

		// Submission status
		status: text('status').notNull().default('forked'),
		// 'forked' → 'submitted' → 'scoring' → 'scored' → 'failed'

		// Submitted code (fetched from GitHub on submit, stored for scoring)
		code: text('code'),

		// AI scoring results (populated async by Mastra workflow)
		score: integer('score'),

		// Recommendation: enum, not free-text
		recommendation: text('recommendation'),
		// Valid values: 'recommend' | 'consider' | 'pass'

		// Prose explanation shown below the recommendation pill
		recommendationNote: text('recommendation_note'),

		// AI report: strengths and gaps
		aiReport: text('ai_report', { mode: 'json' }).$type<{
			strengths: string[];
			gaps: string[];
		}>(),

		// Interview guide: paired Q+A objects (not parallel arrays)
		// Each entry has question, expected_answer, and optional focus_area
		interviewGuide: text('interview_guide', { mode: 'json' }).$type<
			{
				question: string;
				expected_answer: string;
				focus_area?: string;
			}[]
		>(),

		// Timing metadata
		submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }),
		scoredAt: integer('scored_at', { mode: 'timestamp_ms' }),

		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index('submission_challenge_idx').on(table.challengeId),
		index('submission_candidate_idx').on(table.candidateId),
		index('submission_challenge_score_idx').on(table.challengeId, table.score),
	],
);
