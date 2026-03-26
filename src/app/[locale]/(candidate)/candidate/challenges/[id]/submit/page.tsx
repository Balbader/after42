import type { Metadata } from 'next';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import { Link, redirect } from '@/i18n/navigation';

export const metadata: Metadata = {
	title: 'Submit Challenge — after42',
	description: 'Submit your solution for this coding challenge.',
};

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
	const [sessionUser, { id: challengeId }] = await Promise.all([
		requireRole('candidate'),
		params,
	]);

	const [[submission], [ch]] = await Promise.all([
		db
			.select()
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, challengeId),
					eq(candidateSubmission.candidateId, sessionUser.id),
				),
			)
			.limit(1),
		db
			.select()
			.from(challenge)
			.where(eq(challenge.id, challengeId))
			.limit(1),
	]);

	if (!submission) {
		redirect({
			href: `/candidate/challenges/${challengeId}`,
			locale: await getLocale(),
		});
	}

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
