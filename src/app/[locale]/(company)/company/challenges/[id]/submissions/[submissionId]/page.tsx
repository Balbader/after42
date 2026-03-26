import { and, desc, eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { ReviewWorkspace } from '@/components/company';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';

export default async function Page({
	params,
}: {
	params: Promise<{ id: string; submissionId: string }>;
}) {
	const sessionUser = await requireRole('recruiter');
	const { id: challengeId, submissionId } = await params;

	const [ch] = await db
		.select({ id: challenge.id, title: challenge.title, creatorId: challenge.creatorId })
		.from(challenge)
		.where(eq(challenge.id, challengeId))
		.limit(1);

	if (!ch || ch.creatorId !== sessionUser.id) {
		notFound();
	}

	const [sub] = await db
		.select({
			id: candidateSubmission.id,
			sequenceNum: candidateSubmission.sequenceNum,
			score: candidateSubmission.score,
			status: candidateSubmission.status,
			recommendation: candidateSubmission.recommendation,
			recommendationNote: candidateSubmission.recommendationNote,
			aiReport: candidateSubmission.aiReport,
			interviewGuide: candidateSubmission.interviewGuide,
			submittedAt: candidateSubmission.submittedAt,
			scoredAt: candidateSubmission.scoredAt,
		})
		.from(candidateSubmission)
		.where(
			and(
				eq(candidateSubmission.id, submissionId),
				eq(candidateSubmission.challengeId, challengeId),
			),
		)
		.limit(1);

	if (!sub) {
		notFound();
	}

	const allSubs = await db
		.select({
			id: candidateSubmission.id,
			sequenceNum: candidateSubmission.sequenceNum,
			score: candidateSubmission.score,
			recommendation: candidateSubmission.recommendation,
			status: candidateSubmission.status,
		})
		.from(candidateSubmission)
		.where(eq(candidateSubmission.challengeId, challengeId))
		.orderBy(
			desc(sql`coalesce(${candidateSubmission.score}, -1)`),
			desc(candidateSubmission.submittedAt),
		);

	return (
		<ReviewWorkspace
			challengeId={challengeId}
			submission={{
				id: sub.id,
				sequenceNum: sub.sequenceNum,
				score: sub.score,
				status: sub.status,
				recommendation: sub.recommendation as
					| 'recommend'
					| 'consider'
					| 'pass'
					| null,
				recommendationNote: sub.recommendationNote,
				aiReport: sub.aiReport,
				interviewGuide: sub.interviewGuide,
				submittedAt: sub.submittedAt?.toISOString() ?? null,
				scoredAt: sub.scoredAt?.toISOString() ?? null,
			}}
			allSubmissions={allSubs.map((s) => ({
				id: s.id,
				sequenceNum: s.sequenceNum,
				score: s.score,
				recommendation: s.recommendation,
				status: s.status,
			}))}
		/>
	);
}
