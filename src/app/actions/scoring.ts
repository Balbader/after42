'use server';

import { eq } from 'drizzle-orm';

import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { logError } from '@/lib/log-helpers';
import { github } from '@/lib/github';
import { mastra } from '@/mastra/index';
import { headers } from 'next/headers';

export async function triggerScoring(
	submissionId: string,
): Promise<{ ok: boolean } | { error: string }> {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'candidate') {
			return { error: 'Unauthorized' };
		}

		const [submission] = await db
			.select()
			.from(candidateSubmission)
			.where(eq(candidateSubmission.id, submissionId))
			.limit(1);

		if (!submission) {
			return { error: 'Submission not found' };
		}
		if (submission.candidateId !== sessionUser.id) {
			return { error: 'Unauthorized' };
		}
		if (submission.status !== 'submitted') {
			return { error: 'Submission is not ready for scoring' };
		}

		if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
			return { error: 'GitHub integration is not configured' };
		}

		if (!submission.githubForkName) {
			return { error: 'Missing fork for submission' };
		}

		const code = await github.getRepoTree(submission.githubForkName);
		const candidateCode = Object.entries(code)
			.map(([path, content]) => `// === ${path} ===\n${content}`)
			.join('\n\n');

		await db
			.update(candidateSubmission)
			.set({ status: 'scoring' })
			.where(eq(candidateSubmission.id, submissionId));

		try {
			const workflow = mastra.getWorkflow('scoreSubmissionWorkflow');
			const run = await workflow.createRun();
			await run.start({
				inputData: {
					submissionId,
					challengeId: submission.challengeId,
					candidateCode,
				},
			});
		} catch (err) {
			logError('triggerScoring: workflow failed', err);
			await db
				.update(candidateSubmission)
				.set({ status: 'failed' })
				.where(eq(candidateSubmission.id, submissionId));
			throw err;
		}

		return { ok: true };
	} catch (err) {
		logError('triggerScoring failed', err);
		return {
			error: err instanceof Error ? err.message : 'Scoring failed',
		};
	}
}
