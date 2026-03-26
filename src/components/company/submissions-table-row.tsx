'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { REC_COLORS, scoreClass, type Recommendation } from '@/components/company/score-rec-styles';

export type SubmissionRowData = {
	id: string;
	sequenceNum: number;
	score: number | null;
	recommendation: string | null;
	status: string;
	submittedLabel: string;
};

function RecommendationPill({
	recommendation,
}: {
	recommendation: Recommendation;
}) {
	const labels = {
		recommend: 'RECOMMEND',
		consider: 'CONSIDER',
		pass: 'PASS',
	} as const;
	return (
		<span
			className={cn(
				'inline-flex rounded-full border px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase',
				REC_COLORS[recommendation],
			)}
		>
			{labels[recommendation]}
		</span>
	);
}

function StatusBadge({ status }: { status: string }) {
	if (status === 'scored') {
		return (
			<span className='rounded border border-[#86EFAC] bg-[#F0FDF4] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#16A34A]'>
				Scored
			</span>
		);
	}
	if (status === 'failed') {
		return (
			<span className='rounded border border-[#FCA5A5] bg-[#FEF2F2] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#DC2626]'>
				Failed
			</span>
		);
	}
	return (
		<span className='rounded border border-[#FDBA74] bg-[#FFF7ED] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#C2410C]'>
			In Progress
		</span>
	);
}

function ShimmerCell() {
	return (
		<div className='h-4 w-12 animate-pulse rounded bg-linear-to-r from-[#F5F4F1] via-[#FAFAF8] to-[#F5F4F1] bg-size-[200%_100%]' />
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

	let recommendationCell: ReactNode;
	if (scoring) {
		recommendationCell = <ShimmerCell />;
	} else if (isScored && rec) {
		recommendationCell = <RecommendationPill recommendation={rec} />;
	} else if (isScored) {
		recommendationCell = (
			<span className='font-(family-name:--font-dm-sans) text-sm text-[#A8A29E]'>—</span>
		);
	} else if (row.status === 'forked') {
		recommendationCell = (
			<span className='font-(family-name:--font-dm-sans) text-sm text-[#A8A29E]'>—</span>
		);
	} else if (row.status === 'failed') {
		recommendationCell = (
			<span className='font-(family-name:--font-dm-sans) text-sm text-[#A8A29E]'>—</span>
		);
	} else {
		recommendationCell = (
			<span className='font-(family-name:--font-dm-sans) text-sm text-[#A8A29E]'>—</span>
		);
	}

	return (
		<tr
			className='cursor-pointer border-b border-[#E7E5E4] hover:bg-[#F5F4F1]'
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
			<td className='w-12 px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] tabular-nums text-[#78716C]'>
				{rank}
			</td>
			<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
				Candidate{' '}
				<span className='font-(family-name:--font-fraunces) text-[15px] font-normal'>
					#{row.sequenceNum}
				</span>
			</td>
			<td className='px-3 py-3'>
				{scoring ? (
					<ShimmerCell />
				) : isScored ? (
					<span
						className={cn(
							'font-(family-name:--font-dm-sans) text-sm font-medium tabular-nums',
							scoreClass(row.score!),
						)}
					>
						{row.score}
					</span>
				) : (
					<span className='font-(family-name:--font-dm-sans) text-sm tabular-nums text-[#A8A29E]'>
						—
					</span>
				)}
			</td>
			<td className='px-3 py-3'>{recommendationCell}</td>
			<td className='px-3 py-3'>
				<StatusBadge status={row.status} />
			</td>
			<td className='px-3 py-3 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
				{row.submittedLabel}
			</td>
		</tr>
	);
}
