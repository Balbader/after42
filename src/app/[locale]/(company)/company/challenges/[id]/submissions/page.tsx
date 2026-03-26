import type { Metadata } from 'next';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Submissions — after42',
	description: 'Review and rank candidate submissions for this challenge.',
};
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

import {
	EmptyState,
	RecPill,
	RecruiterBackLink,
	RecruiterCard,
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	ScoreBadge,
	SubmissionsClickableRow,
	type SubmissionRowData,
	pickSubmissionTopRows,
} from '@/components/company';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';

type PageProps = {
	params: Promise<{ locale: string; id: string }>;
};

export default async function SubmissionsPage({ params }: PageProps) {
	const { locale, id: challengeId } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('company');

	const sessionUser = await requireRole('recruiter');

	const [ch] = await db
		.select()
		.from(challenge)
		.where(eq(challenge.id, challengeId))
		.limit(1);

	if (!ch || ch.creatorId !== sessionUser.id) notFound();

	const [rows, [totalAgg], [scoredAgg]] = await Promise.all([
		db
			.select({
				id: candidateSubmission.id,
				sequenceNum: candidateSubmission.sequenceNum,
				score: candidateSubmission.score,
				recommendation: candidateSubmission.recommendation,
				status: candidateSubmission.status,
				submittedAt: candidateSubmission.submittedAt,
			})
			.from(candidateSubmission)
			.where(eq(candidateSubmission.challengeId, challengeId))
			.orderBy(
				desc(sql`coalesce(${candidateSubmission.score}, -1)`),
				desc(candidateSubmission.submittedAt),
			),
		db
			.select({ total: count() })
			.from(candidateSubmission)
			.where(eq(candidateSubmission.challengeId, challengeId)),
		db
			.select({ scored: count() })
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, challengeId),
					eq(candidateSubmission.status, 'scored'),
				),
			),
	]);

	const total = totalAgg?.total ?? 0;
	const scored = scoredAgg?.scored ?? 0;

	const tableRows: SubmissionRowData[] = rows.map((r) => ({
		id: r.id,
		sequenceNum: r.sequenceNum,
		score: r.score,
		recommendation: r.recommendation,
		status: r.status,
		submittedLabel: r.submittedAt
			? formatDistanceToNow(r.submittedAt, { addSuffix: true })
			: '—',
	}));

	const topPicks = pickSubmissionTopRows(tableRows, 3);

	return (
		<RecruiterPage>
			<RecruiterBackLink href={`/company/challenges/${challengeId}`}>
				{ch.title}
			</RecruiterBackLink>

			<RecruiterPageHeader
				className='mt-6 border-0 pb-0'
				eyebrow={t('submissionsLabel')}
				title={ch.title}
				description={t('submissionsMeta', { total, scored })}
				actions={
					total > 0 && topPicks[0] ? (
						<RecruiterPrimaryLink
							href={`/company/challenges/${challengeId}/submissions/${topPicks[0].id}`}
						>
							{t('topPickReview')}
						</RecruiterPrimaryLink>
					) : null
				}
			/>

			{rows.length === 0 ? (
				<EmptyState
					title={t('submissionsEmptyTitle')}
					description={t('submissionsEmptyDesc')}
				/>
			) : (
				<>
					{topPicks.length > 0 ? (
						<section className='mt-8' aria-labelledby='top-picks-heading'>
							<h2
								id='top-picks-heading'
								className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'
							>
								{t('topPicksTitle')}
							</h2>
							<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
								{t('topPicksLead')}
							</p>
							<div className='mt-4 grid gap-3 sm:grid-cols-3'>
								{topPicks.map((row) => {
									const rec =
										row.recommendation === 'recommend' ||
										row.recommendation === 'consider' ||
										row.recommendation === 'pass'
											? row.recommendation
											: null;
									const scoredRow =
										row.status === 'scored' && row.score != null;
									return (
										<RecruiterCard
											key={row.id}
											padding='sm'
											className='flex flex-col justify-between'
										>
											<div>
												<p className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
													Candidate{' '}
													<span className='font-(family-name:--font-fraunces) text-lg'>
														#{row.sequenceNum}
													</span>
												</p>
												<div className='mt-2 flex flex-wrap items-center gap-2'>
													{scoredRow ? (
														<ScoreBadge score={row.score!} size='sm' />
													) : null}
													{scoredRow && rec ? <RecPill rec={rec} size='sm' /> : null}
												</div>
											</div>
											<Link
												href={`/company/challenges/${challengeId}/submissions/${row.id}`}
												className='mt-4 inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-accent)] hover:underline'
											>
												{t('topPickReview')}
												<ChevronRight className='size-3.5' />
											</Link>
										</RecruiterCard>
									);
								})}
							</div>
						</section>
					) : null}

					<div className='mt-10 overflow-hidden rounded-2xl border border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)]'>
						<div className='overflow-x-auto'>
							<table className='w-full min-w-160 border-collapse text-left'>
								<thead>
									<tr className='border-b border-[var(--a42-border)] bg-[var(--a42-surface-2)]'>
										{[
											t('tableRank'),
											t('tableCandidate'),
											t('tableScore'),
											t('tableRec'),
											t('tableStatus'),
											t('tableSubmitted'),
										].map((h) => (
											<th
												key={h}
												className='px-3 py-3 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{tableRows.map((row, i) => (
										<SubmissionsClickableRow
											key={row.id}
											challengeId={challengeId}
											rank={i + 1}
											row={row}
										/>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</RecruiterPage>
	);
}
