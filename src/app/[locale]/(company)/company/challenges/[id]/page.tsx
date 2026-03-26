import { and, count, eq, max } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { jobPost } from '@/db/schemas/job-post';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';
import {
	SectionLabel,
	SectionTitle,
	StatusBadge,
	StatCard,
	BtnPrimary,
} from '@/components/company/ui';

export default async function ChallengeDetailPage({
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

	if (!ch || ch.creatorId !== sessionUser.id) notFound();

	const [[totalRow], [scoredAgg], job] = await Promise.all([
		db
			.select({ total: count() })
			.from(candidateSubmission)
			.where(eq(candidateSubmission.challengeId, id)),
		db
			.select({ scored: count(), topScore: max(candidateSubmission.score) })
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, id),
					eq(candidateSubmission.status, 'scored'),
				),
			),
		ch.jobPostId
			? db
					.select({ title: jobPost.title, company: jobPost.company })
					.from(jobPost)
					.where(eq(jobPost.id, ch.jobPostId))
					.limit(1)
					.then((r) => r[0] ?? null)
			: Promise.resolve(null),
	]);

	const readme =
		ch.challengeContent && typeof ch.challengeContent === 'object'
			? (ch.challengeContent as { readme?: string }).readme ?? ''
			: '';
	const html = readme
		? String(await marked.parse(readme, { async: true }))
		: '';

	return (
		<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
			<Link
				href='/company/challenges'
				className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] hover:text-[#1C1917]'
			>
				← My Challenges
			</Link>

			<div className='mt-6'>
				<SectionLabel>Challenge</SectionLabel>
				<SectionTitle className='mt-2'>{ch.title}</SectionTitle>
			</div>

			<div className='mt-3 flex flex-wrap items-center gap-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
				<StatusBadge status={ch.status} />
				<span className='text-[#D6D3D1]'>·</span>
				<span>{ch.seniority_level}</span>
				<span className='text-[#D6D3D1]'>·</span>
				<span>{parseTechStack(ch.tech_stack)}</span>
				<span className='text-[#D6D3D1]'>·</span>
				<span>Created {formatDistanceToNow(ch.createdAt, { addSuffix: true })}</span>
			</div>

			{job && (
				<p className='mt-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
					From job post: {job.title}
					{job.company ? ` · ${job.company}` : ''}
				</p>
			)}

			<div className='mt-8 grid grid-cols-3 gap-3'>
				<StatCard label='Total submissions' value={totalRow?.total ?? 0} />
				<StatCard label='Scored' value={scoredAgg?.scored ?? 0} />
				<StatCard
					label='Top score'
					value={scoredAgg?.topScore ?? '—'}
					accent={scoredAgg?.topScore != null}
				/>
			</div>

			{html && (
				<div className='mt-8'>
					<SectionLabel>Brief</SectionLabel>
					<div className='mt-3 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
						<div
							className='candidate-readme'
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</div>
				</div>
			)}

			{/* Details grid */}
			<div className='mt-8'>
				<SectionLabel>Details</SectionLabel>
				<div className='mt-3 grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-5'>
					<DetailRow label='Seniority' value={ch.seniority_level} />
					<DetailRow label='Tech stack' value={parseTechStack(ch.tech_stack)} />
					<DetailRow label='Location' value={`${ch.location_city}, ${ch.location_country}`} />
					<DetailRow label='Remote' value={ch.remote ? 'Yes' : 'No'} />
					<DetailRow label='Job type' value={ch.job_type} />
					<DetailRow
						label='Salary range'
						value={`${ch.salary_range_min.toLocaleString()}–${ch.salary_range_max.toLocaleString()} ${ch.currency}`}
					/>
				</div>
			</div>

			<div className='mt-8 flex items-center gap-3'>
				{ch.status === 'draft' && !ch.githubRepoName && (
					<div className='rounded border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[#D97706]'>
						GitHub repo not configured — submissions cannot be accepted.
					</div>
				)}
				<Link href={`/company/challenges/${id}/submissions`}>
					<BtnPrimary>
						View submissions ({totalRow?.total ?? 0}) →
					</BtnPrimary>
				</Link>
			</div>
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className='font-(family-name:--font-dm-sans) text-[11px] font-medium tracking-[0.06em] text-[#A8A29E] uppercase'>
				{label}
			</p>
			<p className='mt-0.5 font-(family-name:--font-dm-sans) text-[13px] text-[#1C1917]'>
				{value}
			</p>
		</div>
	);
}
