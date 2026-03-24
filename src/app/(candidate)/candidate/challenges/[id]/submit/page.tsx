import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { SubmitWorkspace } from '@/components/candidate/submit-workspace';
import { TerminalState } from '@/components/candidate/terminal-state';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const sessionUser = await requireRole('candidate');
	const { id: challengeId } = await params;

	const [submission] = await db
		.select()
		.from(candidateSubmission)
		.where(
			and(
				eq(candidateSubmission.challengeId, challengeId),
				eq(candidateSubmission.candidateId, sessionUser.id),
			),
		)
		.limit(1);

	if (!submission) {
		redirect(`/candidate/challenges/${challengeId}`);
	}

	const [ch] = await db
		.select()
		.from(challenge)
		.where(eq(challenge.id, challengeId))
		.limit(1);

	if (!ch) {
		notFound();
	}

	const org = process.env.GITHUB_ORG_NAME ?? '';
	const cloneUrl = org
		? `https://github.com/${org}/${submission.githubForkName}.git`
		: '';

	const terminalStatuses = ['submitted', 'scoring', 'scored', 'failed'];
	if (terminalStatuses.includes(submission.status)) {
		return (
			<div className='mx-auto max-w-3xl px-6 py-10'>
				<Link
					href={`/candidate/challenges/${challengeId}`}
					className='font-(family-name:--font-dm-sans) text-sm text-[#C2410C] hover:text-[#9A3412]'
				>
					← Back to brief
				</Link>
				<TerminalState
					submission={{
						status: submission.status,
						score: submission.score ?? null,
						submittedAt: submission.submittedAt ?? null,
						sequenceNum: submission.sequenceNum,
					}}
				/>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-5xl px-6 py-10'>
			<Link
				href={`/candidate/challenges/${challengeId}`}
				className='mb-8 inline-block font-(family-name:--font-dm-sans) text-sm text-[#C2410C] hover:text-[#9A3412]'
			>
				← Full challenge brief
			</Link>
			<SubmitWorkspace
				challengeId={challengeId}
				cloneUrl={cloneUrl}
				submission={{
					id: submission.id,
					githubForkName: submission.githubForkName,
					sequenceNum: submission.sequenceNum,
				}}
				challenge={{
					title: ch.title,
					challengeContent: ch.challengeContent,
				}}
			/>
		</div>
	);
}
