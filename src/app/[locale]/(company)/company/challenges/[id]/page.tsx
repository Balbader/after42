import type { Metadata } from 'next';
import { and, count, eq, max } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Challenge Detail — after42',
	description: 'View challenge details, stats, and candidate submissions.',
};
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { jobPost } from '@/db/schemas/job-post';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';
import { renderMarkdown } from '@/lib/safe-markdown';
import {
	BtnPrimary,
	RecruiterBackLink,
	RecruiterCard,
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	SectionLabel,
	StatCard,
	StatusBadge,
} from '@/components/company';

type PageProps = {
	params: Promise<{ locale: string; id: string }>;
};

export default async function ChallengeDetailPage({ params }: PageProps) {
	const { locale, id } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('company');

	const sessionUser = await requireRole('recruiter');

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
	const html = readme ? await renderMarkdown(readme) : '';

	const total = totalRow?.total ?? 0;

	return (
		<RecruiterPage>
			<RecruiterBackLink href='/company/challenges'>{t('backToChallenges')}</RecruiterBackLink>

			<RecruiterPageHeader
				className='mt-6 border-0 pb-0'
				eyebrow={t('challengeLabel')}
				title={ch.title}
				description={
					<div className='mt-2 flex flex-wrap items-center gap-2 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
						<StatusBadge status={ch.status} />
						<span className='text-[var(--a42-border-strong)]'>·</span>
						<span>{ch.seniority_level}</span>
						<span className='text-[var(--a42-border-strong)]'>·</span>
						<span>{parseTechStack(ch.tech_stack)}</span>
						<span className='text-[var(--a42-border-strong)]'>·</span>
						<span>
							{formatDistanceToNow(ch.createdAt, { addSuffix: true })}
						</span>
					</div>
				}
				actions={
					<RecruiterPrimaryLink href={`/company/challenges/${id}/submissions`}>
						{t('challengeViewSubmissions')} ({total})
					</RecruiterPrimaryLink>
				}
			/>

			{job ? (
				<p className='mt-2 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
					{t('challengeFromJob')}: {job.title}
					{job.company ? ` · ${job.company}` : ''}
				</p>
			) : null}

			<div className='mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3'>
				<StatCard label={t('detailStatTotal')} value={total} />
				<StatCard label={t('detailStatScored')} value={scoredAgg?.scored ?? 0} />
				<StatCard
					label={t('detailStatTop')}
					value={scoredAgg?.topScore ?? '—'}
					accent={scoredAgg?.topScore != null}
				/>
			</div>

			{html ? (
				<RecruiterCard className='mt-8'>
					<SectionLabel>{t('challengeBrief')}</SectionLabel>
					<div
						className='candidate-readme mt-4 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)]'
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</RecruiterCard>
			) : null}

			<RecruiterCard className='mt-6'>
				<SectionLabel>{t('challengeDetails')}</SectionLabel>
				<div className='mt-4 grid gap-4 sm:grid-cols-2'>
					<DetailRow label='Seniority' value={ch.seniority_level} />
					<DetailRow label='Tech stack' value={parseTechStack(ch.tech_stack)} />
					<DetailRow
						label='Location'
						value={`${ch.location_city}, ${ch.location_country}`}
					/>
					<DetailRow label='Remote' value={ch.remote ? 'Yes' : 'No'} />
					<DetailRow label='Job type' value={ch.job_type} />
					<DetailRow
						label='Salary range'
						value={`${ch.salary_range_min.toLocaleString()}–${ch.salary_range_max.toLocaleString()} ${ch.currency}`}
					/>
				</div>
			</RecruiterCard>

			<div className='mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				{ch.status === 'draft' && !ch.githubRepoName ? (
					<div className='rounded-xl border border-amber-200/90 bg-[var(--a42-score-mid-bg)] px-4 py-3 font-(family-name:--font-dm-sans) text-[13px] text-amber-800 dark:text-amber-200'>
						{t('challengeGithubWarning')}
					</div>
				) : (
					<span />
				)}
				<Link href={`/company/challenges/${id}/submissions`} className='sm:ml-auto'>
					<BtnPrimary className='w-full min-w-50 sm:w-auto'>
						{t('challengeViewSubmissions')} ({total}) →
					</BtnPrimary>
				</Link>
			</div>

			<div className='sticky bottom-0 z-10 mt-8 border-t border-[var(--a42-border)] bg-[var(--a42-bg)]/95 py-4 backdrop-blur-sm md:hidden'>
				<Link href={`/company/challenges/${id}/submissions`} className='block'>
					<BtnPrimary className='w-full justify-center'>
						{t('challengeViewSubmissions')}
					</BtnPrimary>
				</Link>
			</div>
		</RecruiterPage>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className='rounded-lg bg-[var(--a42-bg)] px-3 py-2.5'>
			<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
				{label}
			</p>
			<p className='mt-0.5 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text)]'>
				{value}
			</p>
		</div>
	);
}
