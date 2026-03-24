'use server';

import { eq } from 'drizzle-orm';
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

export async function createChallenge(
	jobPostId: string,
): Promise<{ challengeId: string } | { error: string }> {
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
					challengeContent.starterCode ?? {},
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
			salary_range_min: post.salaryMin ?? 0,
			salary_range_max: post.salaryMax ?? 0,
			currency: post.salaryCurrency ?? 'USD',
			equity: false,
			description: post.description,
			jobPostId,
			creatorId: recruiterId,
			challengeContent: {
				readme: challengeContent.readme,
				starterCode: challengeContent.starterCode,
				evaluationCriteria: challengeContent.evaluationCriteria,
			},
			githubRepoName,
			status: githubRepoName ? 'active' : 'draft',
		});

		return { challengeId };
	} catch (err) {
		logError('createChallenge failed', err);
		return {
			error: err instanceof Error ? err.message : 'Failed to create challenge',
		};
	}
}
