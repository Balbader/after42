import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

import { cn } from '@/lib/utils';
import {
	REC_COLORS,
	scoreHex,
	type Recommendation,
} from '@/components/company/score-rec-styles';

// ─── Section primitives ──────────────────────────────────────────────────────

export function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
			{children}
		</p>
	);
}

export function SectionTitle({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h1
			className={cn(
				'font-(family-name:--font-fraunces) text-[28px] font-medium tracking-[-0.02em] text-[var(--a42-text)]',
				className,
			)}
		>
			{children}
		</h1>
	);
}

// ─── Score badge ─────────────────────────────────────────────────────────────

function scoreBadgeTier(score: number): 'high' | 'mid' | 'low' {
	if (score >= 80) return 'high';
	if (score >= 60) return 'mid';
	return 'low';
}

const SCORE_BADGE_BG: Record<'high' | 'mid' | 'low', string> = {
	high: 'bg-[var(--a42-score-high-bg)]',
	mid: 'bg-[var(--a42-score-mid-bg)]',
	low: 'bg-[var(--a42-score-low-bg)]',
};

export function ScoreBadge({
	score,
	size = 'md',
}: {
	score: number;
	size?: 'sm' | 'md' | 'lg';
}) {
	const tier = scoreBadgeTier(score);
	const sizeMap = {
		sm: 'text-[13px] px-2 py-0.5',
		md: 'text-[15px] px-2.5 py-1',
		lg: 'text-[44px] px-0 py-0',
	};
	return (
		<span
			className={cn(
				'inline-flex items-center font-(family-name:--font-fraunces) font-medium tracking-[-0.02em] rounded-full',
				sizeMap[size],
				size === 'lg' ? '' : SCORE_BADGE_BG[tier],
			)}
			style={{ color: scoreHex(score) }}
		>
			{score}
		</span>
	);
}

// ─── Recommendation pill ─────────────────────────────────────────────────────

const REC_LABELS: Record<Recommendation, Record<string, string>> = {
	recommend: { sm: 'REC', md: 'Recommend', lg: 'RECOMMEND' },
	consider: { sm: 'CONS', md: 'Consider', lg: 'CONSIDER' },
	pass: { sm: 'PASS', md: 'Pass', lg: 'PASS' },
};

const REC_DOTS: Record<Recommendation, string> = {
	recommend: '●',
	consider: '◐',
	pass: '○',
};

export function RecPill({
	rec,
	size = 'md',
}: {
	rec: Recommendation;
	size?: 'sm' | 'md' | 'lg';
}) {
	const sizeMap = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-3 py-1 text-xs',
		lg: 'px-3 py-1.5 text-xs',
	};
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-full border font-(family-name:--font-dm-sans) font-semibold uppercase',
				sizeMap[size],
				REC_COLORS[rec],
			)}
		>
			{size !== 'sm' && <span className='text-[10px]'>{REC_DOTS[rec]}</span>}
			{REC_LABELS[rec][size]}
		</span>
	);
}

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_DOTS: Record<string, string> = {
	scored: 'bg-[color:var(--a42-score-high)]',
	submitted: 'bg-[var(--a42-text-faint)]',
	forked: 'bg-[var(--a42-text-faint)]',
	scoring: 'bg-[var(--a42-accent)]',
	failed: 'bg-[color:var(--a42-score-low)]',
	active: 'bg-[color:var(--a42-score-high)]',
	draft: 'bg-[var(--a42-text-faint)]',
	closed: 'bg-[var(--a42-text-muted)]',
};

const STATUS_LABELS: Record<string, string> = {
	scored: 'Scored',
	submitted: 'Submitted',
	forked: 'Forked',
	scoring: 'Scoring…',
	failed: 'Failed',
	active: 'Active',
	draft: 'Draft',
	closed: 'Closed',
};

export function StatusBadge({ status }: { status: string }) {
	return (
		<span className='inline-flex items-center gap-1.5 rounded-full border border-[var(--a42-border)] bg-[var(--a42-surface-2)] px-2.5 py-1 font-(family-name:--font-dm-sans) text-xs font-medium text-[var(--a42-text-muted)]'>
			<span
				className={cn(
					'size-1.5 rounded-full',
					STATUS_DOTS[status] ?? 'bg-[var(--a42-text-faint)]',
				)}
			/>
			{STATUS_LABELS[status] ?? status}
		</span>
	);
}

// ─── Stat card ───────────────────────────────────────────────────────────────

export function StatCard({
	label,
	value,
	accent,
}: {
	label: string;
	value: string | number;
	accent?: boolean;
}) {
	return (
		<div className='rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] px-4 py-3'>
			<p className='font-(family-name:--font-fraunces) text-[28px] font-medium tracking-[-0.02em] text-[var(--a42-text)]'>
				{accent ? (
					<span style={{ color: scoreHex(Number(value) || 0) }}>
						{value}
					</span>
				) : (
					value
				)}
			</p>
			<p className='mt-0.5 font-(family-name:--font-dm-sans) text-[11px] font-medium tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
				{label}
			</p>
		</div>
	);
}

// ─── Empty state ─────────────────────────────────────────────────────────────

export function EmptyState({
	title,
	description,
	href,
	cta,
}: {
	title: string;
	description: string;
	href?: string;
	cta?: string;
}) {
	return (
		<div className='flex min-h-[30vh] flex-col items-center justify-center px-6 py-12 text-center'>
			<p className='font-(family-name:--font-fraunces) text-xl italic text-[var(--a42-text-muted)]'>
				{title}
			</p>
			<p className='mt-3 max-w-md font-(family-name:--font-dm-sans) text-base text-[var(--a42-text-muted)]'>
				{description}
			</p>
			{href && cta && (
				<Link
					href={href}
					className='mt-6 inline-flex items-center justify-center rounded-md bg-[var(--a42-accent)] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)]'
				>
					{cta}
				</Link>
			)}
		</div>
	);
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
};

export function BtnPrimary({ children, className, ...props }: BtnProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center gap-1.5 rounded-md bg-[var(--a42-accent)] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)] disabled:pointer-events-none disabled:opacity-40',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export function BtnSecondary({ children, className, ...props }: BtnProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center gap-1.5 rounded-md border border-[var(--a42-border-strong)] bg-[var(--a42-surface)] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)] transition-colors hover:border-[var(--a42-text-faint)]',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

export function BtnGhost({ children, className, ...props }: BtnProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center gap-1.5 rounded-md bg-transparent px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text-muted)] transition-colors hover:bg-[var(--a42-surface-2)] hover:text-[var(--a42-text)]',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
