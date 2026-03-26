'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

import {
	listAllSubmissions,
	type AllSubmissionRow,
} from '@/app/actions/challenge';
import {
	EmptyState,
	RecPill,
	RecruiterCard,
	RecruiterSkeletonLine,
	ScoreBadge,
	StatusBadge,
} from '@/components/company';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'recommend' | 'consider' | 'pass';
type Sort = 'score' | 'recent';

const FILTERS: { labelKey: 'filterAll' | 'filterRecommend' | 'filterConsider' | 'filterPass'; value: Filter }[] = [
	{ labelKey: 'filterAll', value: 'all' },
	{ labelKey: 'filterRecommend', value: 'recommend' },
	{ labelKey: 'filterConsider', value: 'consider' },
	{ labelKey: 'filterPass', value: 'pass' },
];

const PAGE_SIZE = 20;

const FOCUS_RING =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]';

function topPickRows(rows: AllSubmissionRow[], max = 4): AllSubmissionRow[] {
	const scored = rows.filter((r) => r.status === 'scored' && r.score != null);
	const picks = scored.filter(
		(r) =>
			r.recommendation === 'recommend' ||
			(r.score != null && r.score >= 80),
	);
	const out: AllSubmissionRow[] = [];
	const seen = new Set<string>();
	for (const r of picks) {
		if (out.length >= max) break;
		out.push(r);
		seen.add(r.id);
	}
	if (out.length < max) {
		const rest = [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
		for (const r of rest) {
			if (out.length >= max) break;
			if (!seen.has(r.id)) {
				out.push(r);
				seen.add(r.id);
			}
		}
	}
	return out;
}

export type RecruiterCandidatesReviewProps = {
	embedded?: boolean;
	/** Dashboard tab links for empty states (locale-aware paths). */
	pipelineTabHref?: string;
	challengesTabHref?: string;
	/** When embedded on unified dashboard: switch to Challenges tab from first-time empty CTA. */
	onEmptyReviewCta?: () => void;
};

export function RecruiterCandidatesReview({
	embedded = false,
	pipelineTabHref = '/dashboard?tab=pipeline',
	challengesTabHref = '/dashboard?tab=challenges',
	onEmptyReviewCta,
}: RecruiterCandidatesReviewProps) {
	const t = useTranslations('company');
	const tDash = useTranslations('dashboard');
	const router = useRouter();
	const [rows, setRows] = useState<AllSubmissionRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<Filter>('all');
	const [sort, setSort] = useState<Sort>('score');
	const [page, setPage] = useState(1);

	useEffect(() => {
		listAllSubmissions()
			.then(setRows)
			.finally(() => setLoading(false));
	}, []);

	const challengeCount = new Set(rows.map((r) => r.challengeId)).size;

	const filtered = useMemo(() => {
		let r =
			filter === 'all' ? rows : rows.filter((x) => x.recommendation === filter);
		r = [...r];
		if (sort === 'score') {
			r.sort(
				(a, b) =>
					(b.score ?? -1) - (a.score ?? -1) ||
					(b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
			);
		} else {
			r.sort(
				(a, b) =>
					(b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0),
			);
		}
		return r;
	}, [rows, filter, sort]);

	const picks = useMemo(() => topPickRows(rows), [rows]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const pageSlice = filtered.slice(
		(safePage - 1) * PAGE_SIZE,
		safePage * PAGE_SIZE,
	);

	const submissionHref = (r: AllSubmissionRow) =>
		`/company/challenges/${r.challengeId}/submissions/${r.id}`;

	if (loading) {
		return (
			<div className={embedded ? 'mt-4 space-y-3' : 'mt-8 space-y-3'}>
				<RecruiterSkeletonLine className='h-24 w-full rounded-2xl' />
				<RecruiterSkeletonLine className='h-24 w-full rounded-2xl' />
			</div>
		);
	}

	if (rows.length === 0) {
		if (embedded && onEmptyReviewCta) {
			return (
				<div className='mt-6'>
					<EmptyState
						eyebrow={tDash('firstTimeReviewEyebrow')}
						title={tDash('firstTimeReviewTitle')}
						description={tDash('firstTimeReviewBody')}
						cta={tDash('firstTimeReviewCta')}
						onCtaClick={onEmptyReviewCta}
					/>
				</div>
			);
		}
		return (
			<div className={embedded ? 'mt-6' : ''}>
				<EmptyState
					title={t('candidatesEmptyTitle')}
					description={
						embedded ? t('reviewEmptyDashboardDesc') : t('candidatesEmptyDesc')
					}
					href={embedded ? challengesTabHref : '/dashboard?tab=pipeline'}
					cta={embedded ? t('reviewEmptyDashboardCta') : t('challengesEmptyCta')}
				/>
				{embedded ? (
					<p className='mt-4 text-center font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
						<Link href={pipelineTabHref} className='font-medium text-[var(--a42-accent)] hover:underline'>
							{t('reviewEmptyPipelineLink')}
						</Link>
					</p>
				) : null}
			</div>
		);
	}

	return (
		<div className={embedded ? 'mt-4' : ''}>
			<div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
				<div className='flex flex-wrap gap-2' role='group' aria-label={t('filterAll')}>
					{FILTERS.map((f) => (
						<button
							key={f.value}
							type='button'
							onClick={() => {
								setFilter(f.value);
								setPage(1);
							}}
							className={cn(
								'rounded-full border px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
								FOCUS_RING,
								filter === f.value
									? 'border-[var(--a42-accent)] bg-[var(--a42-accent-light)] text-[var(--a42-accent)]'
									: 'border-[var(--a42-border)] bg-[var(--a42-surface)] text-[var(--a42-text-muted)] hover:border-[var(--a42-border-strong)]',
							)}
						>
							{t(f.labelKey)}
						</button>
					))}
				</div>
				<div className='flex rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface-2)] p-0.5'>
					<button
						type='button'
						onClick={() => {
							setSort('score');
							setPage(1);
						}}
						className={cn(
							'rounded-md px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
							FOCUS_RING,
							sort === 'score'
								? 'bg-[var(--a42-surface)] text-[var(--a42-text)] shadow-sm'
								: 'text-[var(--a42-text-muted)] hover:text-[var(--a42-text)]',
						)}
					>
						{t('candidatesSortScore')}
					</button>
					<button
						type='button'
						onClick={() => {
							setSort('recent');
							setPage(1);
						}}
						className={cn(
							'rounded-md px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
							FOCUS_RING,
							sort === 'recent'
								? 'bg-[var(--a42-surface)] text-[var(--a42-text)] shadow-sm'
								: 'text-[var(--a42-text-muted)] hover:text-[var(--a42-text)]',
						)}
					>
						{t('candidatesSortRecent')}
					</button>
				</div>
			</div>

			{!embedded && !loading ? (
				<p className='mt-3 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
					{t('candidatesMeta', {
						count: rows.length,
						challenges: challengeCount,
					})}
				</p>
			) : null}

			{filtered.length === 0 ? (
				<div className='mt-10 rounded-2xl border border-dashed border-[var(--a42-border)] bg-[var(--a42-bg)] px-6 py-12 text-center'>
					<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('candidatesFilterEmpty')}
					</p>
				</div>
			) : (
				<>
					{picks.length > 0 ? (
						<section className='mt-8' aria-labelledby='review-top-picks'>
							<h2
								id='review-top-picks'
								className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'
							>
								{t('candidatesTopPicks')}
							</h2>
							<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
								{t('candidatesTopPicksLead')}
							</p>
							<div className='mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible lg:grid-cols-4'>
								{picks.map((r) => {
									const rec =
										r.recommendation === 'recommend' ||
										r.recommendation === 'consider' ||
										r.recommendation === 'pass'
											? r.recommendation
											: null;
									return (
										<RecruiterCard
											key={r.id}
											padding='sm'
											className='w-[min(100%,280px)] shrink-0 snap-start sm:w-auto'
										>
											<p className='font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
												{r.challengeTitle}
											</p>
											<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
												Candidate{' '}
												<span className='font-(family-name:--font-fraunces) text-lg'>
													#{r.sequenceNum}
												</span>
											</p>
											<div className='mt-2 flex flex-wrap gap-2'>
												{r.score != null ? (
													<ScoreBadge score={r.score} size='sm' />
												) : null}
												{rec ? <RecPill rec={rec} size='sm' /> : null}
											</div>
											<button
												type='button'
												onClick={() => router.push(submissionHref(r))}
												className='mt-3 inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-accent)] hover:underline'
											>
												{t('topPickReview')}
												<ChevronRight className='size-3.5' />
											</button>
										</RecruiterCard>
									);
								})}
							</div>
						</section>
					) : null}

					{/* Desktop / tablet table */}
					<div className='mt-10 hidden overflow-hidden rounded-2xl border border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)] sm:block'>
						<div className='overflow-x-auto'>
							<table className='w-full min-w-160 border-collapse text-left'>
								<thead>
									<tr className='border-b border-[var(--a42-border)] bg-[var(--a42-surface-2)]'>
										{[
											t('tableCandidate'),
											t('challengeLabel'),
											t('tableScore'),
											t('tableRec'),
											t('tableStatus'),
											t('tableSubmitted'),
											t('tableReview'),
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
									{pageSlice.map((r) => {
										const isScored = r.status === 'scored' && r.score != null;
										const rec =
											r.recommendation === 'recommend' ||
											r.recommendation === 'consider' ||
											r.recommendation === 'pass'
												? r.recommendation
												: null;

										return (
											<tr
												key={r.id}
												className='border-b border-[var(--a42-border)] transition-colors hover:bg-[var(--a42-surface-2)]'
											>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text)]'>
													Candidate{' '}
													<span className='font-(family-name:--font-fraunces)'>
														#{r.sequenceNum}
													</span>
												</td>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
													{r.challengeTitle}
												</td>
												<td className='px-3 py-3'>
													{isScored ? (
														<ScoreBadge score={r.score!} size='sm' />
													) : (
														<span className='text-sm text-[var(--a42-text-faint)]'>—</span>
													)}
												</td>
												<td className='px-3 py-3'>
													{rec ? (
														<RecPill rec={rec} size='sm' />
													) : (
														<span className='text-sm text-[var(--a42-text-faint)]'>—</span>
													)}
												</td>
												<td className='px-3 py-3'>
													<StatusBadge status={r.status} />
												</td>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
													{r.submittedAt
														? formatDistanceToNow(r.submittedAt, {
																addSuffix: true,
															})
														: '—'}
												</td>
												<td className='px-3 py-3'>
													<button
														type='button'
														onClick={() => router.push(submissionHref(r))}
														className='font-(family-name:--font-dm-sans) text-[12px] font-medium text-[var(--a42-accent)] hover:underline'
													>
														{t('topPickReview')}
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>

					{/* Mobile cards */}
					<div className='mt-6 space-y-3 sm:hidden'>
						{pageSlice.map((r) => {
							const isScored = r.status === 'scored' && r.score != null;
							const rec =
								r.recommendation === 'recommend' ||
								r.recommendation === 'consider' ||
								r.recommendation === 'pass'
									? r.recommendation
									: null;
							return (
								<RecruiterCard key={r.id} padding='sm' className='p-4'>
									<div className='flex items-start justify-between gap-2'>
										<div>
											<p className='font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
												{r.challengeTitle}
											</p>
											<p className='mt-0.5 font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)]'>
												Candidate #{r.sequenceNum}
											</p>
										</div>
										{isScored ? <ScoreBadge score={r.score!} size='sm' /> : null}
									</div>
									<div className='mt-2 flex flex-wrap gap-2'>
										{rec ? <RecPill rec={rec} size='sm' /> : null}
										<StatusBadge status={r.status} />
									</div>
									<p className='mt-2 font-(family-name:--font-dm-sans) text-[12px] text-[var(--a42-text-muted)]'>
										{r.submittedAt
											? formatDistanceToNow(r.submittedAt, { addSuffix: true })
											: '—'}
									</p>
									<button
										type='button'
										onClick={() => router.push(submissionHref(r))}
										className='mt-3 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-accent)] hover:underline'
									>
										{t('topPickReview')}
									</button>
								</RecruiterCard>
							);
						})}
					</div>

					{filtered.length > PAGE_SIZE ? (
						<div className='mt-6 flex items-center justify-center gap-3 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
							<button
								type='button'
								disabled={safePage <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className={cn(
									'rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] px-3 py-1.5 font-medium disabled:opacity-40',
									FOCUS_RING,
								)}
							>
								{t('paginationPrev')}
							</button>
							<span className='tabular-nums'>
								{t('paginationPage', { current: safePage, total: totalPages })}
							</span>
							<button
								type='button'
								disabled={safePage >= totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								className={cn(
									'rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] px-3 py-1.5 font-medium disabled:opacity-40',
									FOCUS_RING,
								)}
							>
								{t('paginationNext')}
							</button>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}
