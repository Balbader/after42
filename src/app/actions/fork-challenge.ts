'use server';

import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db } from '@/db';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { challenge } from '@/db/schemas/challenge';
import { github } from '@/lib/github';
import { logError } from '@/lib/log-helpers';
import { requireRole } from '@/lib/require-role';

const ORG = process.env.GITHUB_ORG_NAME;

export async function forkChallenge(
	challengeId: string,
): Promise<
	| { submissionId: string; forkName: string; cloneUrl: string }
	| { error: string }
> {
	try {
		const sessionUser = await requireRole('candidate');

		if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
			return { error: 'GitHub integration not configured.' };
		}
		if (!ORG) {
			return { error: 'GitHub integration not configured.' };
		}

		const [ch] = await db
			.select()
			.from(challenge)
			.where(eq(challenge.id, challengeId))
			.limit(1);

		if (!ch) {
			return { error: 'Challenge not found.' };
		}
		if (ch.status === 'draft') {
			return { error: 'This challenge is not available yet.' };
		}
		if (ch.status !== 'active') {
			return { error: 'This challenge is not available.' };
		}
		if (!ch.githubRepoName) {
			return { error: 'Challenge repository is not ready.' };
		}

		const [existing] = await db
			.select()
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, challengeId),
					eq(candidateSubmission.candidateId, sessionUser.id),
				),
			)
			.limit(1);

		if (existing) {
			const cloneUrl = `https://github.com/${ORG}/${existing.githubForkName}.git`;
			return {
				submissionId: existing.id,
				forkName: existing.githubForkName,
				cloneUrl,
			};
		}

		let sequenceNum = 0;
		await db.transaction(async (tx) => {
			await tx.run(
				sql`INSERT OR IGNORE INTO challenge_counter (challenge_id, seq) VALUES (${challengeId}, 0)`,
			);
			await tx.run(
				sql`UPDATE challenge_counter SET seq = seq + 1 WHERE challenge_id = ${challengeId}`,
			);
			const row = await tx.get<{ seq: number }>(
				sql`SELECT seq FROM challenge_counter WHERE challenge_id = ${challengeId}`,
			);
			if (row?.seq == null || row.seq < 1) {
				throw new Error('Failed to assign sequence number');
			}
			sequenceNum = row.seq;
		});

		const candidateAlias = `cand-${sequenceNum}`;
		const { forkName, cloneUrl } = await github.forkChallengeRepo(
			ch.githubRepoName,
			candidateAlias,
		);

		const submissionId = nanoid();
		await db.insert(candidateSubmission).values({
			id: submissionId,
			challengeId,
			candidateId: sessionUser.id,
			sequenceNum,
			githubForkName: forkName,
			status: 'forked',
		});

		return { submissionId, forkName, cloneUrl };
	} catch (err) {
		logError('forkChallenge failed', err);
		return {
			error:
				err instanceof Error ? err.message : 'Could not start the challenge.',
		};
	}
}
