'use client';

import { formatDistanceToNow } from 'date-fns';

type SubmissionLite = {
	status: string;
	score: number | null;
	submittedAt: Date | null;
	sequenceNum: number;
};

export function TerminalState({ submission }: { submission: SubmissionLite }) {
	const submittedAt = submission.submittedAt
		? formatDistanceToNow(submission.submittedAt, { addSuffix: true })
		: 'recently';

	if (submission.status === 'submitted' || submission.status === 'scoring') {
		return (
			<div className='mx-auto max-w-lg px-6 py-16 text-center'>
				<p className='font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#1C1917]'>
					Submitted {submittedAt}
				</p>
				<p className='mt-4 font-[family-name:var(--font-dm-sans)] text-base text-[#78716C]'>
					Your code is locked and under review.
				</p>
				<p className='mt-6 flex items-center justify-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#78716C]'>
					<span
						className='inline-block size-2 animate-pulse rounded-full bg-[#78716C]'
						aria-hidden
					/>
					Scoring in progress…
				</p>
			</div>
		);
	}

	if (submission.status === 'scored' && submission.score != null) {
		const s = submission.score;
		const color =
			s >= 80 ? '#16A34A' : s >= 60 ? '#D97706' : '#DC2626';
		return (
			<div className='mx-auto max-w-lg px-6 py-16 text-center'>
				<p className='font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#1C1917]'>
					Submitted {submittedAt}
				</p>
				<div className='mt-8 flex items-baseline justify-center gap-1'>
					<span
						className='font-[family-name:var(--font-fraunces)] text-[48px] font-normal leading-none'
						style={{ color }}
					>
						{s}
					</span>
					<span className='font-[family-name:var(--font-dm-sans)] text-2xl text-[#78716C]'>
						/100
					</span>
				</div>
				<p className='mt-6 font-[family-name:var(--font-dm-sans)] text-base text-[#78716C]'>
					Results are in.
				</p>
			</div>
		);
	}

	if (submission.status === 'failed') {
		return (
			<div className='mx-auto max-w-lg px-6 py-16 text-center'>
				<p className='font-[family-name:var(--font-fraunces)] text-[22px] italic text-[#DC2626]'>
					Scoring failed.
				</p>
				<p className='mt-4 font-[family-name:var(--font-dm-sans)] text-sm text-[#78716C]'>
					Something went wrong during scoring. Please contact support.
				</p>
			</div>
		);
	}

	return null;
}
