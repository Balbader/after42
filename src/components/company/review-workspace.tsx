'use client';

import { useRouter } from '@/i18n/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { scoreHex, type Recommendation } from '@/components/company/score-rec-styles';
import { RecPill, ScoreBadge, StatusBadge } from '@/components/company/ui';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Left rail row ───────────────────────────────────────────────────────────

function CandidateRow({
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
	const rec = isValidRec(sub.recommendation) ? sub.recommendation : null;
	const scored = sub.status === 'scored' && sub.score != null;

	return (
		<button
			type='button'
			onClick={() => {
				router.push(
					`/company/challenges/${challengeId}/submissions/${sub.id}`,
				);
				onNavigate();
			}}
			className={cn(
				'w-full cursor-pointer border-b border-[var(--a42-border)] px-4 py-3 text-left transition-colors',
				active
					? 'border-l-2 border-l-[var(--a42-accent)] bg-[var(--a42-accent-light)]'
					: 'border-l-2 border-l-transparent hover:bg-[var(--a42-surface-2)]',
			)}
		>
			<div className='flex items-center justify-between'>
				<span className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
					Candidate #{sub.sequenceNum}
				</span>
				{scored && <ScoreBadge score={sub.score!} size='sm' />}
			</div>
			<div className='mt-1 flex items-center gap-2'>
				{rec && scored ? (
					<RecPill rec={rec} size='sm' />
				) : (
					<StatusBadge status={sub.status} />
				)}
			</div>
		</button>
	);
}

// ─── QA Accordion ────────────────────────────────────────────────────────────

function InterviewGuideAccordion({ items }: { items: GuideItem[] }) {
	const [openIdx, setOpenIdx] = useState<number | null>(0);
	const toggle = useCallback(
		(i: number) => setOpenIdx((prev) => (prev === i ? null : i)),
		[],
	);

	return (
		<div className='interview-guide-print'>
			<p className='mb-3 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
				Interview questions
			</p>
			{items.map((item, i) => {
				const open = openIdx === i;
				return (
					<div
						key={i}
						className='mb-2 overflow-hidden rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface-2)]'
					>
						<button
							type='button'
							className='flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left'
							onClick={() => toggle(i)}
							aria-expanded={open}
						>
							<span className='mt-0.5 shrink-0 font-mono text-[11px] text-[var(--a42-accent)]'>
								Q{i + 1}
							</span>
							<span className='min-w-0 flex-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
								{item.question}
							</span>
							<span className='mt-0.5 shrink-0 text-[var(--a42-text-faint)]'>
								{open ? (
									<ChevronDown className='size-3' />
								) : (
									<ChevronRight className='size-3' />
								)}
							</span>
						</button>
						{open && (
							<div className='guide-answer border-t border-[var(--a42-border)] px-4 py-3'>
								{item.focus_area && (
									<span className='mb-2 inline-flex rounded-full border border-[var(--a42-border)] bg-[var(--a42-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--a42-text-faint)]'>
										{item.focus_area}
									</span>
								)}
								<p className='font-(family-name:--font-dm-sans) text-xs leading-relaxed text-[var(--a42-text-muted)]'>
									<strong className='text-[var(--a42-text)]'>
										Strong answer includes:{' '}
									</strong>
									{item.expected_answer}
								</p>
							</div>
						)}
					</div>
				);
			})}
			<button
				type='button'
				className='mt-4 rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface)] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)] transition-colors hover:border-[var(--a42-border-strong)]'
				onClick={() => window.print()}
			>
				Print Interview Guide
			</button>
		</div>
	);
}

// ─── Right rail: evidence panel ──────────────────────────────────────────────

function EvidencePanel({
	submission,
}: {
	submission: ReviewSubmission;
}) {
	const rec = isValidRec(submission.recommendation)
		? submission.recommendation
		: null;
	const report = submission.aiReport;
	const scoring =
		submission.status === 'submitted' || submission.status === 'scoring';

	if (scoring) {
		return (
			<div className='space-y-4'>
				<div className='h-10 w-full animate-pulse rounded bg-[var(--a42-surface-2)]' />
				<div className='h-24 w-full animate-pulse rounded bg-[var(--a42-surface-2)]' />
			</div>
		);
	}

	if (submission.status !== 'scored' || submission.score == null) return null;

	return (
		<div>
			{/* Score */}
			<div className='mb-5'>
				<p className='mb-2 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
					Score
				</p>
				<div className='rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface-2)] px-4 py-4 text-center'>
					<span
						className='font-(family-name:--font-fraunces) text-[44px] font-medium leading-none tracking-[-0.04em]'
						style={{ color: scoreHex(submission.score) }}
					>
						{submission.score}
					</span>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
						out of 100
					</p>
				</div>
			</div>

			{/* Strengths */}
			<div className='mb-5'>
				<p className='mb-2 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
					Strengths
				</p>
				{(report?.strengths ?? []).map((t, i) => (
					<div
						key={i}
						className='mb-1 rounded-sm bg-[var(--a42-score-high-bg)] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-xs text-[color:var(--a42-score-high)]'
					>
						↑ {t}
					</div>
				))}
			</div>

			{/* Gaps */}
			<div className='mb-5'>
				<p className='mb-2 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
					Gaps
				</p>
				{(report?.gaps ?? []).length === 0 ? (
					<p className='font-(family-name:--font-dm-sans) text-xs italic text-[var(--a42-text-muted)]'>
						No significant gaps.
					</p>
				) : (
					(report?.gaps ?? []).map((t, i) => (
						<div
							key={i}
							className='mb-1 rounded-sm bg-[var(--a42-surface-2)] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-muted)]'
						>
							○ {t}
						</div>
					))
				)}
			</div>

			{/* Recommendation */}
			<div className='mb-5'>
				<p className='mb-2 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
					Recommendation
				</p>
				<div className='rounded-md border border-[var(--a42-accent)] bg-[var(--a42-accent-light)] p-3'>
					{rec && (
						<p className='mb-1.5 font-(family-name:--font-dm-sans) text-[10px] font-semibold tracking-[0.06em] text-[var(--a42-accent)] uppercase'>
							{rec === 'recommend'
								? '● Recommend'
								: rec === 'consider'
									? '◐ Consider'
									: '○ Pass'}
						</p>
					)}
					{submission.recommendationNote && (
						<p className='font-(family-name:--font-dm-sans) text-xs leading-relaxed text-[var(--a42-text)]'>
							{submission.recommendationNote}
						</p>
					)}
				</div>
			</div>

			<button
				type='button'
				className='w-full rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface)] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)] transition-colors hover:border-[var(--a42-border-strong)]'
				onClick={() => window.print()}
			>
				Print
			</button>
		</div>
	);
}

// ─── Main workspace ──────────────────────────────────────────────────────────

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

	const sortedRail = useMemo(
		() =>
			[...allSubmissions].sort(
				(a, b) => (b.score ?? -1) - (a.score ?? -1),
			),
		[allSubmissions],
	);

	const scoring =
		submission.status === 'submitted' || submission.status === 'scoring';

	useEffect(() => {
		if (!scoring) return;
		const id = window.setInterval(() => router.refresh(), 5000);
		return () => clearInterval(id);
	}, [scoring, router]);

	const rec = isValidRec(submission.recommendation)
		? submission.recommendation
		: null;
	const guide = submission.interviewGuide ?? [];

	return (
		<div className='flex h-[calc(100vh-4rem)] flex-col overflow-hidden md:flex-row'>
			{/* Mobile sheet trigger */}
			<button
				type='button'
				className='shrink-0 border-b border-[var(--a42-border)] bg-[var(--a42-bg)] px-4 py-2 text-left font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)] md:hidden'
				onClick={() => setSheetOpen(true)}
			>
				All Submissions ▾
			</button>

			{/* LEFT RAIL — 280px */}
			<aside className='hidden w-70 shrink-0 overflow-y-auto border-r border-[var(--a42-border)] md:block'>
				<div className='border-b border-[var(--a42-border)] px-4 pt-3.5 pb-2.5'>
					<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
						Submissions
					</p>
					<p className='mt-0.5 font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
						Sorted by score
					</p>
				</div>
				{sortedRail.map((s) => (
					<CandidateRow
						key={s.id}
						challengeId={challengeId}
						sub={s}
						active={s.id === submission.id}
						onNavigate={() => { }}
					/>
				))}
			</aside>

			{/* Mobile bottom sheet */}
			{sheetOpen && (
				<button
					type='button'
					className='fixed inset-0 z-40 bg-black/40 md:hidden'
					aria-label='Close submissions list'
					onClick={() => setSheetOpen(false)}
				/>
			)}
			<div
				className={cn(
					'fixed inset-x-0 bottom-0 z-50 max-h-[55vh] overflow-y-auto rounded-t-xl border border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-lg transition-transform duration-300 md:hidden',
					sheetOpen
						? 'translate-y-0'
						: 'pointer-events-none translate-y-full',
				)}
			>
				<div className='sticky top-0 flex items-center justify-between border-b border-[var(--a42-border)] bg-[var(--a42-surface)] px-4 py-3'>
					<p className='font-(family-name:--font-dm-sans) text-sm font-semibold text-[var(--a42-text)]'>
						Submissions
					</p>
					<button
						type='button'
						className='font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)]'
						onClick={() => setSheetOpen(false)}
					>
						Close
					</button>
				</div>
				{sortedRail.map((s) => (
					<CandidateRow
						key={s.id}
						challengeId={challengeId}
						sub={s}
						active={s.id === submission.id}
						onNavigate={() => setSheetOpen(false)}
					/>
				))}
			</div>

			{/* CENTER — Interview guide */}
			<main className='min-h-0 flex-1 overflow-y-auto'>
				{scoring ? (
					<div className='px-6 py-6'>
						<div className='space-y-4'>
							<div className='h-6 w-48 animate-pulse rounded bg-[var(--a42-surface-2)]' />
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className='h-16 w-full animate-pulse rounded bg-[var(--a42-surface-2)]'
								/>
							))}
						</div>
					</div>
				) : submission.status === 'failed' ? (
					<div className='px-6 py-6'>
						<p className='font-(family-name:--font-fraunces) text-[22px] italic text-red-600 dark:text-red-400'>
							Scoring failed.
						</p>
						<p className='mt-3 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
							Something went wrong. The candidate&apos;s code was received.
						</p>
					</div>
				) : submission.status === 'scored' ? (
					<>
						{/* Guide header */}
						<div className='border-b border-[var(--a42-border)] px-6 pt-5 pb-4'>
							<p className='font-mono text-[11px] tracking-[0.08em] text-[var(--a42-accent)] uppercase'>
								Candidate #{submission.sequenceNum} · Interview guide
							</p>
							<h1 className='mt-1.5 font-(family-name:--font-fraunces) text-[22px] font-medium tracking-[-0.02em] text-[var(--a42-text)]'>
								Candidate #{submission.sequenceNum}
							</h1>
							<div className='mt-2.5 flex flex-wrap items-center gap-2'>
								{rec && <RecPill rec={rec} size='md' />}
								{submission.score != null && (
									<span className='font-(family-name:--font-dm-sans) text-[13px] tabular-nums text-[var(--a42-text-muted)]'>
										<span className='font-(family-name:--font-fraunces) text-[15px] font-medium text-[var(--a42-text)]'>
											{submission.score}
										</span>
										/100
									</span>
								)}
							</div>
						</div>

						{/* Guide body */}
						<div className='px-6 py-5'>
							{guide.length > 0 ? (
								<InterviewGuideAccordion items={guide} />
							) : (
								<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
									No interview guide available.
								</p>
							)}
						</div>
					</>
				) : (
					<div className='px-6 py-6'>
						<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
							Waiting for the candidate to submit their solution.
						</p>
					</div>
				)}
			</main>

			{/* RIGHT RAIL — 240px */}
			<aside className='w-full shrink-0 overflow-y-auto border-t border-[var(--a42-border)] px-4 py-5 md:w-60 md:border-t-0 md:border-l md:border-[var(--a42-border)]'>
				<EvidencePanel submission={submission} />
			</aside>
		</div>
	);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidRec(
	v: string | null | undefined,
): v is Recommendation {
	return v === 'recommend' || v === 'consider' || v === 'pass';
}
