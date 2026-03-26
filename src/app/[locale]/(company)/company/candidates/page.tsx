'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { formatDistanceToNow } from 'date-fns';

import {
	listAllSubmissions,
	type AllSubmissionRow,
} from '@/app/actions/challenge';
import {
	SectionLabel,
	SectionTitle,
	ScoreBadge,
	RecPill,
	StatusBadge,
	EmptyState,
} from '@/components/company/ui';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'recommend' | 'consider' | 'pass';

const FILTERS: { label: string; value: Filter }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Recommend', value: 'recommend' },
	{ label: 'Consider', value: 'consider' },
	{ label: 'Pass', value: 'pass' },
];

export default function AllCandidatesPage() {
	const router = useRouter();
	const [rows, setRows] = useState<AllSubmissionRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<Filter>('all');

	useEffect(() => {
		listAllSubmissions()
			.then(setRows)
			.finally(() => setLoading(false));
	}, []);

	const filtered =
		filter === 'all'
			? rows
			: rows.filter((r) => r.recommendation === filter);

	const challengeCount = new Set(rows.map((r) => r.challengeId)).size;

	return (
		<div className='mx-auto w-full max-w-4xl px-4 pt-8'>
			<SectionLabel>Candidates</SectionLabel>
			<SectionTitle className='mt-2'>All candidates</SectionTitle>
			{!loading && (
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					{rows.length} across {challengeCount} challenge
					{challengeCount !== 1 ? 's' : ''}
				</p>
			)}

			{/* Filters */}
			<div className='mt-6 flex gap-2'>
				{FILTERS.map((f) => (
					<button
						key={f.value}
						type='button'
						onClick={() => setFilter(f.value)}
						className={cn(
							'rounded-full border px-3 py-1 font-(family-name:--font-dm-sans) text-xs font-medium transition-colors',
							filter === f.value
								? 'border-[#C2410C] bg-[#FFF7ED] text-[#C2410C]'
								: 'border-[#E7E5E4] bg-[#FFFFFF] text-[#78716C] hover:border-[#D6D3D1]',
						)}
					>
						{f.label}
					</button>
				))}
			</div>

			{loading ? (
				<div className='mt-8 space-y-3'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className='h-12 w-full animate-pulse rounded bg-[#F5F4F1]'
						/>
					))}
				</div>
			) : filtered.length === 0 ? (
				<EmptyState
					title='No candidates yet.'
					description='Candidates will appear here once they start your challenges.'
				/>
			) : (
				<div className='mt-6 overflow-x-auto rounded-lg border border-[#E7E5E4]'>
					<table className='w-full min-w-[640px] border-collapse text-left'>
						<thead>
							<tr className='border-b border-[#E7E5E4] bg-[#F5F4F1]'>
								{[
									'Candidate',
									'Challenge',
									'Score',
									'Recommendation',
									'Status',
									'Submitted',
								].map((h) => (
									<th
										key={h}
										className='px-3 py-2.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map((r) => {
								const isScored =
									r.status === 'scored' && r.score != null;
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
												<ScoreBadge
													score={r.score!}
													size='sm'
												/>
											) : (
												<span className='text-sm text-[#A8A29E]'>
													—
												</span>
											)}
										</td>
										<td className='px-3 py-3'>
											{rec ? (
												<RecPill rec={rec} size='sm' />
											) : (
												<span className='text-sm text-[#A8A29E]'>
													—
												</span>
											)}
										</td>
										<td className='px-3 py-3'>
											<StatusBadge status={r.status} />
										</td>
										<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
											{r.submittedAt
												? formatDistanceToNow(
														new Date(r.submittedAt),
														{ addSuffix: true },
													)
												: '—'}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
