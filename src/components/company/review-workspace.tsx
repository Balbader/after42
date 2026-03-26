'use client';

import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REC_COLORS, scoreHex, type Recommendation } from '@/components/company/score-rec-styles';

type AiReport = { strengths: string[]; gaps: string[] } | null;

type GuideItem = {
	question: string;
	expected_answer: string;
	focus_area?: string;
};

export type ReviewSubmission = {
	id: string;
	sequenceNum: number;
	score: number | null;
	status: string;
	recommendation: 'recommend' | 'consider' | 'pass' | null;
	recommendationNote: string | null;
	aiReport: AiReport;
	interviewGuide: GuideItem[] | null;
	submittedAt: string | null;
	scoredAt: string | null;
};

type RailSubmission = {
	id: string;
	sequenceNum: number;
	score: number | null;
	recommendation: string | null;
	status: string;
};

function LargeRecPill({
	rec,
}: {
	rec: Recommendation;
}) {
	const label = { recommend: 'RECOMMEND', consider: 'CONSIDER', pass: 'PASS' } as const;
	return (
		<span
			className={cn(
				'inline-flex rounded-full border px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-semibold uppercase',
				REC_COLORS[rec],
			)}
		>
			{label[rec]}
		</span>
	);
}

function SmallRecPill({ rec }: { rec: Recommendation }) {
	const label = { recommend: 'REC', consider: 'CONS', pass: 'PASS' } as const;
	return (
		<span
			className={cn(
				'rounded-full border px-1.5 py-0.5 font-(family-name:--font-dm-sans) text-[10px] font-semibold uppercase',
				REC_COLORS[rec],
			)}
		>
			{label[rec]}
		</span>
	);
}

function RailRow({
	challengeId,
	sub,
	active,
	onNavigate,
}: {
	challengeId: string;
	sub: RailSubmission;
	active: boolean;
	onNavigate: () => void;
}) {
	const router = useRouter();
	const rec =
		sub.recommendation === 'recommend' ||
		sub.recommendation === 'consider' ||
		sub.recommendation === 'pass'
			? sub.recommendation
			: null;
	const scored = sub.status === 'scored' && sub.score != null;

	const go = () => {
		router.push(`/company/challenges/${challengeId}/submissions/${sub.id}`);
		onNavigate();
	};

	return (
		<button
			type='button'
			onClick={go}
			className={cn(
				'w-full cursor-pointer border-b border-[#E7E5E4] px-4 py-3 text-left transition-colors',
				active
					? 'border-l-[3px] border-l-[#C2410C] bg-[#FFF7ED]'
					: 'border-l-[3px] border-l-transparent hover:bg-[#F5F4F1]',
			)}
		>
			<div className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#1C1917]'>
				Candidate{' '}
				<span className='font-(family-name:--font-fraunces) text-[14px] font-normal'>
					#{sub.sequenceNum}
				</span>
			</div>
			<div className='mt-1 flex flex-wrap items-center gap-2'>
				{scored ? (
					<span
						className='font-(family-name:--font-dm-sans) text-[11px] font-medium tabular-nums'
						style={{ color: scoreHex(sub.score!) }}
					>
						{sub.score}
					</span>
				) : (
					<span className='font-(family-name:--font-dm-sans) text-[11px] text-[#A8A29E]'>
						—
					</span>
				)}
				{rec && scored ? <SmallRecPill rec={rec} /> : null}
			</div>
		</button>
	);
}

function InterviewGuideAccordion({
	items,
}: {
	items: GuideItem[];
}) {
	const [openIdx, setOpenIdx] = useState<number | null>(0);

	const toggle = useCallback((i: number) => {
		setOpenIdx((prev) => (prev === i ? null : i));
	}, []);

	return (
		<div className='interview-guide-print'>
			<h2 className='mb-4 font-(family-name:--font-dm-sans) text-sm font-semibold text-[#1C1917]'>
				Interview Guide
			</h2>
			{items.map((item, i) => {
				const open = openIdx === i;
				return (
					<div
						key={i}
						className='mb-3 overflow-hidden rounded-lg border border-[#E7E5E4]'
					>
						<button
							type='button'
							className='flex w-full cursor-pointer items-start gap-3 bg-[#FFFFFF] px-4 py-3 text-left hover:bg-[#F5F4F1]'
							onClick={() => toggle(i)}
							aria-expanded={open}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									toggle(i);
								}
							}}
						>
							{item.focus_area ? (
								<span className='mt-0.5 shrink-0 rounded bg-[#F5F4F1] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-wide text-[#78716C] uppercase'>
									{item.focus_area}
								</span>
							) : null}
							<span className='min-w-0 flex-1 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
								{item.question}
							</span>
							<span className='shrink-0 font-(family-name:--font-dm-sans) text-xs text-[#A8A29E]'>
								{open ? <ChevronDown className="size-3 text-[#A8A29E]" /> : <ChevronRight className="size-3 text-[#A8A29E]" />}
							</span>
						</button>
						<div
							className={cn(
								'guide-answer border-t border-[#E7E5E4] bg-[#FAFAF8] px-4 py-3',
								!open && 'hidden',
							)}
						>
							<p className='mb-1 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
								Expected answer
							</p>
							<p className='font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#1C1917]'>
								{item.expected_answer}
							</p>
						</div>
					</div>
				);
			})}
			<button
				type='button'
				className='mt-4 rounded border border-[#E7E5E4] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] transition-colors hover:border-[#D6D3D1]'
				onClick={() => window.print()}
			>
				Print Interview Guide
			</button>
		</div>
	);
}

type Props = {
	challengeId: string;
	submission: ReviewSubmission;
	allSubmissions: RailSubmission[];
};

export function ReviewWorkspace({
	challengeId,
	submission,
	allSubmissions,
}: Props) {
	const router = useRouter();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);

	const sortedRail = useMemo(
		() =>
			[...allSubmissions].sort((a, b) => {
				const as = a.score ?? -1;
				const bs = b.score ?? -1;
				return bs - as;
			}),
		[allSubmissions],
	);

	const submittedRel = submission.submittedAt
		? formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })
		: 'recently';

	const scoring =
		submission.status === 'submitted' || submission.status === 'scoring';

	useEffect(() => {
		if (!scoring) return;
		const id = window.setInterval(() => {
			router.refresh();
		}, 5000);
		return () => clearInterval(id);
	}, [scoring, router]);

	const rec =
		submission.recommendation === 'recommend' ||
		submission.recommendation === 'consider' ||
		submission.recommendation === 'pass'
			? submission.recommendation
			: null;

	const guide = submission.interviewGuide ?? [];
	const report = submission.aiReport;

	return (
		<div className='flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:flex-row'>
			<button
				type='button'
				className='shrink-0 border-b border-[#E7E5E4] bg-[#FAFAF8] px-4 py-2 text-left font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917] md:hidden'
				onClick={() => setSheetOpen(true)}
			>
				All Submissions
			</button>

			<aside className='hidden w-[280px] shrink-0 overflow-y-auto border-r border-[#E7E5E4] md:block'>
				<p className='px-4 pt-4 pb-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
					Submissions
				</p>
				{sortedRail.map((s) => (
					<RailRow
						key={s.id}
						challengeId={challengeId}
						sub={s}
						active={s.id === submission.id}
						onNavigate={() => {}}
					/>
				))}
			</aside>

			{sheetOpen ? (
				<button
					type='button'
					className='fixed inset-0 z-40 bg-black/40 md:hidden'
					aria-label='Close submissions list'
					onClick={() => setSheetOpen(false)}
				/>
			) : null}
			<div
				className={cn(
					'fixed inset-x-0 bottom-0 z-50 max-h-[55vh] overflow-y-auto rounded-t-xl border border-[#E7E5E4] bg-[#FFFFFF] shadow-lg transition-transform duration-300 md:hidden',
					sheetOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none',
				)}
			>
				<div className='sticky top-0 flex items-center justify-between border-b border-[#E7E5E4] bg-[#FFFFFF] px-4 py-3'>
					<p className='font-(family-name:--font-dm-sans) text-sm font-semibold text-[#1C1917]'>
						Submissions
					</p>
					<button
						type='button'
						className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'
						onClick={() => setSheetOpen(false)}
					>
						Close
					</button>
				</div>
				{sortedRail.map((s) => (
					<RailRow
						key={s.id}
						challengeId={challengeId}
						sub={s}
						active={s.id === submission.id}
						onNavigate={() => setSheetOpen(false)}
					/>
				))}
			</div>

			<main className='min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8'>
				{scoring ? (
					<div className='space-y-4'>
						<div className='h-6 w-48 animate-pulse rounded bg-[#F5F4F1]' />
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='mb-3 h-16 w-full animate-pulse rounded bg-[#F5F4F1]'
							/>
						))}
					</div>
				) : submission.status === 'failed' ? (
					<div>
						<p className='font-(family-name:--font-fraunces) text-[22px] italic text-[#DC2626]'>
							Scoring failed.
						</p>
						<p className='mt-3 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
							Something went wrong. The candidate&apos;s code was received.
						</p>
						<a
							href='mailto:support@after42.ai'
							className='mt-4 inline-block font-(family-name:--font-dm-sans) text-sm text-[#C2410C] hover:text-[#9A3412]'
						>
							Contact support
						</a>
					</div>
				) : submission.status === 'scored' ? (
					<>
						<header className='mb-6'>
							<h1 className='mb-1 font-(family-name:--font-fraunces) text-[28px] font-normal text-[#1C1917]'>
								Candidate #{submission.sequenceNum}
							</h1>
							<p className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
								Submitted {submittedRel}
							</p>
						</header>

						{guide.length > 0 ? (
							<InterviewGuideAccordion items={guide} />
						) : null}

						<div className='mt-8 border-t border-[#E7E5E4]'>
							<button
								type='button'
								className='flex w-full items-center justify-between py-3 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#78716C]'
								onClick={() => setCodeOpen((o) => !o)}
							>
								<span><span className='flex items-center gap-1.5'>Code Evidence {codeOpen ? <ChevronDown className='size-3' /> : <ChevronRight className='size-3' />}</span></span>
							</button>
							{codeOpen ? (
								<p className='pb-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
									Code is archived in the GitHub repository.
								</p>
							) : null}
						</div>
					</>
				) : (
					<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
						Waiting for the candidate to submit their solution.
					</p>
				)}
			</main>

			<aside className='w-full shrink-0 overflow-y-auto border-t border-[#E7E5E4] px-4 py-6 md:w-60 md:border-t-0 md:border-l md:border-[#E7E5E4]'>
				{submission.status === 'scored' && submission.score != null ? (
					<div>
						<div className='mb-6'>
							<p className='mb-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
								Recommendation
							</p>
							{rec ? <LargeRecPill rec={rec} /> : null}
							{submission.recommendationNote ? (
								<p className='mt-2 font-(family-name:--font-dm-sans) text-[13px] italic text-[#78716C]'>
									{submission.recommendationNote}
								</p>
							) : null}
						</div>

						<div className='mb-6 flex items-baseline gap-1'>
							<span
								className='font-(family-name:--font-fraunces) text-[48px] font-normal leading-none'
								style={{ color: scoreColor(submission.score) }}
							>
								{submission.score}
							</span>
							<span className='font-(family-name:--font-dm-sans) text-lg text-[#78716C]'>
								/100
							</span>
						</div>

						<hr className='mb-6 border-[#E7E5E4]' />

						<div className='mb-6'>
							<p className='mb-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
								Strengths
							</p>
							<ul className='space-y-2'>
								{(report?.strengths ?? []).map((t, i) => (
									<li
										key={i}
										className='font-(family-name:--font-dm-sans) text-[13px] leading-relaxed text-[#16A34A]'
									>
										+ {t}
									</li>
								))}
							</ul>
						</div>

						<div className='mb-6'>
							<p className='mb-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
								Gaps
							</p>
							{(report?.gaps ?? []).length === 0 ? (
								<p className='font-(family-name:--font-dm-sans) text-[13px] italic text-[#78716C]'>
									No significant gaps.
								</p>
							) : (
								<ul className='space-y-2'>
									{(report?.gaps ?? []).map((t, i) => (
										<li
											key={i}
											className='font-(family-name:--font-dm-sans) text-[13px] leading-relaxed text-[#DC2626]'
										>
											− {t}
										</li>
									))}
								</ul>
							)}
						</div>

						<hr className='mb-6 border-[#E7E5E4]' />

						<button
							type='button'
							className='w-full rounded border border-[#E7E5E4] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] transition-colors hover:border-[#D6D3D1]'
							onClick={() => window.print()}
						>
							Print
						</button>
					</div>
				) : scoring ? (
					<div className='space-y-4'>
						<div className='h-10 w-full animate-pulse rounded bg-[#F5F4F1]' />
						<div className='h-24 w-full animate-pulse rounded bg-[#F5F4F1]' />
					</div>
				) : null}
			</aside>
		</div>
	);
}
