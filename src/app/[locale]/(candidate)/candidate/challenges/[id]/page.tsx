import type { Metadata } from 'next';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';

import { Link, redirect } from '@/i18n/navigation';
import { renderMarkdown } from '@/lib/safe-markdown';

export const metadata: Metadata = {
	title: 'Challenge Details — after42',
	description: 'View challenge details and start your coding assessment.',
};

import { ForkChallengeBtn } from '@/components/candidate/fork-challenge-btn';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';

type ChallengeContent = {
	readme: string;
	starterCode?: Record<string, string>;
	evaluationCriteria?: string[];
	estimatedDuration?: string;
};

function parseTechStack(raw: string): string {
	try {
		const arr = JSON.parse(raw) as unknown;
		return Array.isArray(arr) ? arr.join(', ') : raw;
	} catch {
		return raw;
	}
}

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [sessionUser, { id }] = await Promise.all([
		requireRole('candidate'),
		params,
	]);

	const [[ch], [submission]] = await Promise.all([
		db
			.select()
			.from(challenge)
			.where(eq(challenge.id, id))
			.limit(1),
		db
			.select()
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, id),
					eq(candidateSubmission.candidateId, sessionUser.id),
				),
			)
			.limit(1),
	]);

	if (!ch || ch.status !== 'active') {
		notFound();
	}

	if (submission && submission.status !== 'forked') {
		redirect({
			href: `/candidate/challenges/${id}/submit`,
			locale: await getLocale(),
		});
	}

	const content = ch.challengeContent as ChallengeContent | null;
	const readme = content?.readme ?? '';
	const html = readme ? await renderMarkdown(readme) : '';

	const duration = content?.estimatedDuration;
	const techLabel = parseTechStack(ch.tech_stack);

	return (
		<div className='mx-auto max-w-180 px-8 py-8'>
			<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.06em] text-[#78716C]'>
				TAKE-HOME CHALLENGE
			</p>
			<h1 className='mt-2 mb-2 font-(family-name:--font-fraunces) text-4xl font-normal text-[#1C1917]'>
				{ch.title}
			</h1>
			<div className='flex flex-wrap items-center gap-x-3 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
				<span>{ch.seniority_level}</span>
				{duration ? (
					<>
						<span className='text-[#D6D3D1]'>·</span>
						<span>{duration}</span>
					</>
				) : null}
				<span className='text-[#D6D3D1]'>·</span>
				<span>{techLabel}</span>
			</div>

			<hr className='my-6 border-[#E7E5E4]' />

			{html ? (
				<div
					className='candidate-readme'
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			) : (
				<p className='font-(family-name:--font-dm-sans) text-[#78716C]'>
					No brief available.
				</p>
			)}

			<hr className='my-6 border-[#E7E5E4]' />

			<div className='pt-2'>
				{submission?.status === 'forked' ? (
					<Link
						href={`/candidate/challenges/${id}/submit`}
						className='inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412]'
					>
						Continue Challenge →
					</Link>
				) : (
					<ForkChallengeBtn challengeId={id} />
				)}
			</div>
		</div>
	);
}
