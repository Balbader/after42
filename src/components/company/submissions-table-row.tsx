'use client';

import { useRouter } from '@/i18n/navigation';

import { cn } from '@/lib/utils';
import { scoreClass } from '@/components/company/score-rec-styles';
import {
	RecPill,
	StatusBadge as StatusBadgeUI,
} from '@/components/company/ui';

export type SubmissionRowData = {
	id: string;
	sequenceNum: number;
	score: number | null;
	recommendation: string | null;
	status: string;
	submittedLabel: string;
};

function ShimmerCell() {
	return (
		<div className='h-4 w-12 animate-pulse rounded bg-linear-to-r from-[var(--a42-surface-2)] via-[var(--a42-bg)] to-[var(--a42-surface-2)] bg-size-[200%_100%]' />
	);
}

export function SubmissionsClickableRow({
	challengeId,
	rank,
	row,
}: {
	challengeId: string;
	rank: number;
	row: SubmissionRowData;
}) {
	const router = useRouter();
	const href = `/company/challenges/${challengeId}/submissions/${row.id}`;
	const scoring =
		row.status === 'submitted' || row.status === 'scoring';
	const isScored = row.status === 'scored' && row.score != null;
	const rec =
		row.recommendation === 'recommend' ||
		row.recommendation === 'consider' ||
		row.recommendation === 'pass'
			? row.recommendation
			: null;

	const go = () => router.push(href);

	return (
		<tr
			className='cursor-pointer border-b border-[var(--a42-border)] transition-colors hover:bg-[var(--a42-surface-2)]'
			role='link'
			tabIndex={0}
			onClick={go}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					go();
				}
			}}
		>
			{/* Rank */}
			<td className='w-12 px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] tabular-nums text-[var(--a42-text-muted)]'>
				{rank}
			</td>

			{/* Candidate */}
			<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text)]'>
				Candidate{' '}
				<span className='font-(family-name:--font-fraunces) text-[15px] font-normal'>
					#{row.sequenceNum}
				</span>
			</td>

			{/* Score */}
			<td className='px-3 py-3'>
				{scoring ? (
					<ShimmerCell />
				) : isScored ? (
					<span
						className={cn(
							'font-(family-name:--font-fraunces) text-[15px] font-medium tabular-nums',
							scoreClass(row.score!),
						)}
					>
						{row.score}
					</span>
				) : (
					<span className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-faint)]'>
						—
					</span>
				)}
			</td>

			{/* Recommendation */}
			<td className='px-3 py-3'>
				{scoring ? (
					<ShimmerCell />
				) : isScored && rec ? (
					<RecPill rec={rec} size='sm' />
				) : (
					<span className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-faint)]'>
						—
					</span>
				)}
			</td>

			{/* Status */}
			<td className='px-3 py-3'>
				<StatusBadgeUI status={row.status} />
			</td>

			{/* Submitted */}
			<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'>
				{row.submittedLabel}
			</td>
		</tr>
	);
}
