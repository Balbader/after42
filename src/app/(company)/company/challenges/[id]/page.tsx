import { and, count, eq, max } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import { marked } from 'marked';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClipboardList, CircleCheck, Trophy } from 'lucide-react';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { jobPost } from '@/db/schemas/job-post';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';

function StatusPill({ status }: { status: string }) {
	if (status === 'active') {
		return (
			<span className='rounded-full border border-[#86EFAC] bg-[#F0FDF4] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#16A34A]'>
				Active
			</span>
		);
	}
	return (
		<span className='rounded-full border border-[#E7E5E4] bg-[#F5F4F1] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#78716C]'>
			Draft
		</span>
	);
}

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const sessionUser = await requireRole('recruiter');
	const { id } = await params;

	const [ch] = await db
		.select()
		.from(challenge)
		.where(eq(challenge.id, id))
		.limit(1);

	if (!ch || ch.creatorId !== sessionUser.id) {
		notFound();
	}

	const [totalRow] = await db
		.select({ total: count() })
		.from(candidateSubmission)
		.where(eq(candidateSubmission.challengeId, id));

	const [scoredAgg] = await db
		.select({
			scored: count(),
			topScore: max(candidateSubmission.score),
		})
		.from(candidateSubmission)
		.where(
			and(
				eq(candidateSubmission.challengeId, id),
				eq(candidateSubmission.status, 'scored'),
			),
		);

	const job =
		ch.jobPostId != null
			? await db
					.select({ title: jobPost.title, company: jobPost.company })
					.from(jobPost)
					.where(eq(jobPost.id, ch.jobPostId))
					.limit(1)
					.then((r) => r[0] ?? null)
			: null;

	const readme =
		ch.challengeContent && typeof ch.challengeContent === 'object'
			? (ch.challengeContent as { readme?: string }).readme ?? ''
			: '';
	const html = readme
		? String(await marked.parse(readme, { async: true }))
		: '';

	const createdRel = formatDistanceToNow(ch.createdAt, { addSuffix: true });
	const techLabel = parseTechStack(ch.tech_stack);

	return (
		<div className='mx-auto max-w-200 px-8 py-8'>
			<Link
				href='/company/challenges'
				className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] hover:text-[#1C1917]'
			>
				← My Challenges
			</Link>

			<p className='mt-6 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.06em] text-[#78716C]'>
				CHALLENGE
			</p>
			<h1 className='mt-2 font-(family-name:--font-fraunces) text-4xl font-normal text-[#1C1917]'>
				{ch.title}
			</h1>

			<div className='mt-4 flex flex-wrap items-center gap-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
				<StatusPill status={ch.status} />
				<span className='text-[#D6D3D1]'>·</span>
				<span>{ch.seniority_level}</span>
				<span className='text-[#D6D3D1]'>·</span>
				<span>{techLabel}</span>
				<span className='text-[#D6D3D1]'>·</span>
				<span>Created {createdRel}</span>
			</div>

			{job ? (
				<p className='mt-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
					From job post: {job.title}
					{job.company ? ` · ${job.company}` : ''}
				</p>
			) : null}

			<hr className='my-6 border-[#E7E5E4]' />

			<div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
				<div className='flex items-start gap-3'>
					<ClipboardList className='mt-0.5 size-5 shrink-0 text-[#78716C]' aria-hidden />
					<div>
						<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.04em] text-[#78716C]'>
							Total submissions
						</p>
						<p className='font-(family-name:--font-dm-sans) text-xl font-medium tabular-nums text-[#1C1917]'>
							{totalRow?.total ?? 0}
						</p>
					</div>
				</div>
				<div className='flex items-start gap-3'>
					<CircleCheck className='mt-0.5 size-5 shrink-0 text-[#78716C]' aria-hidden />
					<div>
						<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.04em] text-[#78716C]'>
							Scored
						</p>
						<p className='font-(family-name:--font-dm-sans) text-xl font-medium tabular-nums text-[#1C1917]'>
							{scoredAgg?.scored ?? 0}
						</p>
					</div>
				</div>
				<div className='flex items-start gap-3'>
					<Trophy className='mt-0.5 size-5 shrink-0 text-[#78716C]' aria-hidden />
					<div>
						<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase tracking-[0.04em] text-[#78716C]'>
							Top score
						</p>
						<p className='font-(family-name:--font-dm-sans) text-xl font-medium tabular-nums text-[#1C1917]'>
							{scoredAgg?.topScore != null ? scoredAgg.topScore : '—'}
						</p>
					</div>
				</div>
			</div>

			<hr className='my-6 border-[#E7E5E4]' />

			<div className='rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
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
			</div>

			<div className='mt-8'>
				{ch.status === 'draft' && ch.githubRepoName == null ? (
					<div className='mb-4 rounded border border-[#FDE68A] bg-[#FFFBEB] p-3 font-(family-name:--font-dm-sans) text-[13px] text-[#D97706]'>
						GitHub repo not created — submissions cannot be accepted until GitHub is
						configured.
					</div>
				) : null}
				<Link
					href={`/company/challenges/${id}/submissions`}
					className='inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412]'
				>
					View Submissions →
				</Link>
			</div>
		</div>
	);
}
