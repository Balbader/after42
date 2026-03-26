'use server';

import { and, desc, eq, inArray, max, count, sql } from 'drizzle-orm';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { nanoid } from 'nanoid';

import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { challenge } from '@/db/schemas/challenge';
import { jobPost } from '@/db/schemas/job-post';
import { logError } from '@/lib/log-helpers';
import { github } from '@/lib/github';
import {
	challengeGeneratorTool,
	type ChallengeGeneratorOutput,
} from '@/mastra/tools/challenge-generator-tool';
import { headers } from 'next/headers';

export type CreateChallengePreview = {
	challengeId: string;
	title: string;
	seniority_level: string;
	techStack: string[];
	status: string;
};

export async function createChallenge(
	jobPostId: string,
): Promise<CreateChallengePreview | { error: string }> {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return { error: 'Unauthorized' };
		}
		const recruiterId = sessionUser.id;

		const [post] = await db
			.select()
			.from(jobPost)
			.where(eq(jobPost.id, jobPostId))
			.limit(1);

		if (!post) {
			return { error: 'Job post not found' };
		}
		if (post.recruiterId !== recruiterId) {
			return { error: 'Unauthorized' };
		}
		if (post.processingStatus !== 'completed') {
			return { error: 'Job post is not ready' };
		}

		const requiredSkills = post.requiredSkills ?? [];

		const challengeContent = (await challengeGeneratorTool.execute!(
			{
				title: post.title,
				description: post.description,
				requiredSkills,
				experienceLevel: post.experienceLevel as
					| 'junior'
					| 'mid'
					| 'senior'
					| 'lead',
				techStack: requiredSkills,
			},
			{} as never,
		)) as ChallengeGeneratorOutput;

		const challengeId = nanoid();

		let githubRepoName: string | null = null;
		if (process.env.GITHUB_APP_ID && process.env.GITHUB_APP_PRIVATE_KEY) {
			try {
				githubRepoName = await github.createChallengeRepo(
					challengeId,
					challengeContent.readme,
					(challengeContent.starterCode ?? {}) as Record<string, string>,
				);
			} catch (err) {
				logError('createChallenge: GitHub repo creation failed', err);
			}
		}

		await db.insert(challenge).values({
			id: challengeId,
			title: challengeContent.title,
			seniority_level: challengeContent.difficulty,
			tech_stack: JSON.stringify(requiredSkills),
			location_country: 'Remote',
			location_city: '',
			remote: true,
			job_type: post.type,
			engineering_category: challengeContent.engineeringCategory,
			salary_range_min: post.salaryMin ?? 0,
			salary_range_max: post.salaryMax ?? 0,
			currency: post.salaryCurrency ?? 'USD',
			equity: false,
			description: post.description,
			jobPostId,
			creatorId: recruiterId,
			challengeContent: {
				readme: challengeContent.readme,
				starterCode: challengeContent.starterCode as Record<string, string>,
				evaluationCriteria: challengeContent.evaluationCriteria,
			},
			githubRepoName,
			status: githubRepoName ? 'active' : 'draft',
		});

		return {
			challengeId,
			title: challengeContent.title,
			seniority_level: challengeContent.difficulty,
			techStack: requiredSkills,
			status: githubRepoName ? 'active' : 'draft',
		};
	} catch (err) {
		logError('createChallenge failed', err);
		return {
			error: err instanceof Error ? err.message : 'Failed to create challenge',
		};
	}
}

export type AllSubmissionRow = {
	id: string;
	challengeId: string;
	challengeTitle: string;
	sequenceNum: number;
	score: number | null;
	recommendation: string | null;
	status: string;
	submittedAt: Date | null;
};

export async function listAllSubmissions(): Promise<AllSubmissionRow[]> {
	const { user } = await authController.requireSession(await headers());
	const sessionUser = user as User | null;
	if (!sessionUser || sessionUser.role !== 'recruiter') return [];
	const recruiterId = sessionUser.id;

	const rows = await db
		.select({
			id: candidateSubmission.id,
			challengeId: candidateSubmission.challengeId,
			challengeTitle: challenge.title,
			sequenceNum: candidateSubmission.sequenceNum,
			score: candidateSubmission.score,
			recommendation: candidateSubmission.recommendation,
			status: candidateSubmission.status,
			submittedAt: candidateSubmission.submittedAt,
		})
		.from(candidateSubmission)
		.innerJoin(challenge, eq(candidateSubmission.challengeId, challenge.id))
		.where(eq(challenge.creatorId, recruiterId))
		.orderBy(
			desc(sql`coalesce(${candidateSubmission.score}, -1)`),
			desc(candidateSubmission.submittedAt),
		);

	return rows;
}

export type RecruiterChallengeDashboardRow = {
	id: string;
	title: string;
	seniority_level: string;
	tech_stack: string;
	/** Primary discipline (frontend, backend, full-stack, …) */
	engineering_category: string;
	status: string;
	/** ISO string when returned through server actions to the client */
	createdAt: Date | string | null;
};

export type ChallengeSubmissionStats = {
	n: number;
	topScore: number | null;
};

/** Challenges + per-challenge submission aggregates for recruiter dashboard. */
export async function listRecruiterChallengesDashboard(): Promise<{
	challenges: RecruiterChallengeDashboardRow[];
	statsById: Record<string, ChallengeSubmissionStats>;
} | { error: string }> {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return { error: 'Unauthorized' };
		}
		const recruiterId = sessionUser.id;

		const challenges = await db
			.select({
				id: challenge.id,
				title: challenge.title,
				seniority_level: challenge.seniority_level,
				tech_stack: challenge.tech_stack,
				engineering_category: challenge.engineering_category,
				status: challenge.status,
				createdAt: challenge.createdAt,
			})
			.from(challenge)
			.where(eq(challenge.creatorId, recruiterId))
			.orderBy(desc(challenge.createdAt));

		if (challenges.length === 0) {
			return { challenges: [], statsById: {} };
		}

		const ids = challenges.map((c) => c.id);
		const statsRows = await db
			.select({
				challengeId: candidateSubmission.challengeId,
				n: count(),
				topScore: max(candidateSubmission.score),
			})
			.from(candidateSubmission)
			.where(inArray(candidateSubmission.challengeId, ids))
			.groupBy(candidateSubmission.challengeId);

		const statsById: Record<string, ChallengeSubmissionStats> = {};
		for (const r of statsRows) {
			statsById[r.challengeId] = { n: r.n, topScore: r.topScore ?? null };
		}

		return { challenges, statsById };
	} catch (err) {
		logError('listRecruiterChallengesDashboard failed', err);
		return {
			error: err instanceof Error ? err.message : 'Failed to load challenges',
		};
	}
}

export async function closeChallenge(
	challengeId: string,
): Promise<{ ok: true } | { error: string }> {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return { error: 'Unauthorized' };
		}

		const [row] = await db
			.select({ creatorId: challenge.creatorId })
			.from(challenge)
			.where(eq(challenge.id, challengeId))
			.limit(1);

		if (!row || row.creatorId !== sessionUser.id) {
			return { error: 'Challenge not found' };
		}

		await db
			.update(challenge)
			.set({ status: 'closed' })
			.where(and(eq(challenge.id, challengeId), eq(challenge.creatorId, sessionUser.id)));

		return { ok: true };
	} catch (err) {
		logError('closeChallenge failed', err);
		return {
			error: err instanceof Error ? err.message : 'Failed to archive challenge',
		};
	}
}
