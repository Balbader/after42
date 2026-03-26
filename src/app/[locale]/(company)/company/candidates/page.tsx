'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
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
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	RecruiterSkeletonLine,
	ScoreBadge,
	StatusBadge,
} from '@/components/company';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'recommend' | 'consider' | 'pass';
type Sort = 'score' | 'recent';

const FILTERS: { labelKey: 'filterAll' | 'filterRecommend' | 'filterConsider' | 'filterPass'; value: Filter }[] = [
	{ labelKey: 'filterAll', value: 'all' },
	{ labelKey: 'filterRecommend', value: 'recommend' },
	{ labelKey: 'filterConsider', value: 'consider' },
	{ labelKey: 'filterPass', value: 'pass' },
];

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

export default function AllCandidatesPage() {
	const t = useTranslations('company');
	const router = useRouter();
	const [rows, setRows] = useState<AllSubmissionRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<Filter>('all');
	const [sort, setSort] = useState<Sort>('score');

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

	return (
		<RecruiterPage>
			<RecruiterPageHeader
				eyebrow={t('candidatesLabel')}
				title={t('candidatesTitle')}
				description={
					!loading
						? t('candidatesMeta', {
								count: rows.length,
								challenges: challengeCount,
							})
						: undefined
				}
				actions={
					picks[0] ? (
						<RecruiterPrimaryLink
							href={`/company/challenges/${picks[0].challengeId}/submissions/${picks[0].id}`}
						>
							{t('topPickReview')}
						</RecruiterPrimaryLink>
					) : null
				}
			/>

			<div className='mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
				<div className='flex flex-wrap gap-2' role='group' aria-label={t('filterAll')}>
					{FILTERS.map((f) => (
						<button
							key={f.value}
							type='button'
							onClick={() => setFilter(f.value)}
							className={cn(
								'rounded-full border px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
								filter === f.value
									? 'border-[#C2410C] bg-[#FFF7ED] text-[#C2410C]'
									: 'border-[#E7E5E4] bg-[#FFFFFF] text-[#78716C] hover:border-[#D6D3D1]',
							)}
						>
							{t(f.labelKey)}
						</button>
					))}
				</div>
				<div className='flex rounded-lg border border-[#E7E5E4] bg-[#F5F4F1] p-0.5'>
					<button
						type='button'
						onClick={() => setSort('score')}
						className={cn(
							'rounded-md px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
							sort === 'score'
								? 'bg-[#FFFFFF] text-[#1C1917] shadow-sm'
								: 'text-[#78716C] hover:text-[#1C1917]',
						)}
					>
						{t('candidatesSortScore')}
					</button>
					<button
						type='button'
						onClick={() => setSort('recent')}
						className={cn(
							'rounded-md px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
							sort === 'recent'
								? 'bg-[#FFFFFF] text-[#1C1917] shadow-sm'
								: 'text-[#78716C] hover:text-[#1C1917]',
						)}
					>
						{t('candidatesSortRecent')}
					</button>
				</div>
			</div>

			{loading ? (
				<div className='mt-8 space-y-3'>
					<RecruiterSkeletonLine className='h-24 w-full rounded-2xl' />
					<RecruiterSkeletonLine className='h-24 w-full rounded-2xl' />
				</div>
			) : rows.length === 0 ? (
				<EmptyState
					title={t('candidatesEmptyTitle')}
					description={t('candidatesEmptyDesc')}
					href='/challenge/create'
					cta={t('createChallenge')}
				/>
			) : filtered.length === 0 ? (
				<div className='mt-10 rounded-2xl border border-dashed border-[#E7E5E4] bg-[#FAFAF8] px-6 py-12 text-center'>
					<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
						{t('candidatesFilterEmpty')}
					</p>
				</div>
			) : (
				<>
					{picks.length > 0 ? (
						<section className='mt-8' aria-labelledby='all-top-picks'>
							<h2
								id='all-top-picks'
								className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'
							>
								{t('candidatesTopPicks')}
							</h2>
							<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
								{t('candidatesTopPicksLead')}
							</p>
							<div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
								{picks.map((r) => {
									const rec =
										r.recommendation === 'recommend' ||
										r.recommendation === 'consider' ||
										r.recommendation === 'pass'
											? r.recommendation
											: null;
									return (
										<RecruiterCard key={r.id} padding='sm'>
											<p className='font-(family-name:--font-dm-sans) text-[11px] text-[#A8A29E]'>
												{r.challengeTitle}
											</p>
											<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#1C1917]'>
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
												onClick={() =>
													router.push(
														`/company/challenges/${r.challengeId}/submissions/${r.id}`,
													)
												}
												className='mt-3 inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] hover:underline'
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

					<div className='mt-10 overflow-hidden rounded-2xl border border-[#E7E5E4] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(28,25,23,0.04)]'>
						<div className='overflow-x-auto'>
							<table className='w-full min-w-160 border-collapse text-left'>
								<thead>
									<tr className='border-b border-[#E7E5E4] bg-[#F5F4F1]'>
										{[
											t('tableCandidate'),
											t('challengeLabel'),
											t('tableScore'),
											t('tableRec'),
											t('tableStatus'),
											t('tableSubmitted'),
										].map((h) => (
											<th
												key={h}
												className='px-3 py-3 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{filtered.map((r) => {
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
												className='cursor-pointer border-b border-[#E7E5E4] transition-colors hover:bg-[#F5F4F1]'
												onClick={() =>
													router.push(
														`/company/challenges/${r.challengeId}/submissions/${r.id}`,
													)
												}
											>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
													Candidate{' '}
													<span className='font-(family-name:--font-fraunces)'>
														#{r.sequenceNum}
													</span>
												</td>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
													{r.challengeTitle}
												</td>
												<td className='px-3 py-3'>
													{isScored ? (
														<ScoreBadge score={r.score!} size='sm' />
													) : (
														<span className='text-sm text-[#A8A29E]'>—</span>
													)}
												</td>
												<td className='px-3 py-3'>
													{rec ? (
														<RecPill rec={rec} size='sm' />
													) : (
														<span className='text-sm text-[#A8A29E]'>—</span>
													)}
												</td>
												<td className='px-3 py-3'>
													<StatusBadge status={r.status} />
												</td>
												<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
													{r.submittedAt
														? formatDistanceToNow(r.submittedAt, {
																addSuffix: true,
															})
														: '—'}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</RecruiterPage>
	);
}
