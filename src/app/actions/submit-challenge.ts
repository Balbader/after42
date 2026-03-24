'use server';

import { eq } from 'drizzle-orm';

import { triggerScoring } from '@/app/actions/scoring';
import { db } from '@/db';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { github } from '@/lib/github';
import { logError } from '@/lib/log-helpers';
import { requireRole } from '@/lib/require-role';

export async function submitChallenge(
	submissionId: string,
): Promise<{ ok: boolean } | { error: string }> {
	try {
		const sessionUser = await requireRole('candidate');

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
		if (submission.status !== 'forked') {
			return { error: 'Already submitted' };
		}

		if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
			return { error: 'GitHub integration not configured' };
		}

		await github.archiveFork(submission.githubForkName);

		await db
			.update(candidateSubmission)
			.set({
				status: 'submitted',
				submittedAt: new Date(),
			})
			.where(eq(candidateSubmission.id, submissionId));

		void triggerScoring(submissionId).catch((err) =>
			logError('submitChallenge: triggerScoring failed', err),
		);

		return { ok: true };
	} catch (err) {
		logError('submitChallenge failed', err);
		return {
			error: err instanceof Error ? err.message : 'Submit failed',
		};
	}
}
