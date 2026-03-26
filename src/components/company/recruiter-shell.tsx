import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

const CARD_SHADOW =
	'shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)]';

/** Max 1200px + padding per DESIGN.md recruiter workspace. */
export function RecruiterPage({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div
			className={cn(
				'mx-auto w-full max-w-300 px-4 pb-10 pt-4 md:pt-6',
				className,
			)}
		>
			{children}
		</div>
	);
}

export function RecruiterBackLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className='group inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-(--a42-text-muted) transition-colors hover:text-(--a42-text)'
		>
			<ChevronLeft className='size-3.5 transition-transform group-hover:-translate-x-0.5' />
			{children}
		</Link>
	);
}

export function RecruiterPageHeader({
	eyebrow,
	title,
	description,
	actions,
	className,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<header
			className={cn(
				'flex flex-col gap-4 border-b border-(--a42-border) pb-6 md:flex-row md:items-start md:justify-between',
				className,
			)}
		>
			<div className='min-w-0 flex-1'>
				{eyebrow != null ? (
					<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-(--a42-text-faint) uppercase'>
						{eyebrow}
					</p>
				) : null}
				<h1 className='mt-1 font-(family-name:--font-fraunces) text-[clamp(1.5rem,4vw,1.75rem)] font-medium tracking-[-0.02em] text-(--a42-text)'>
					{title}
				</h1>
				{description ? (
					<div className='mt-2 max-w-2xl font-(family-name:--font-dm-sans) text-sm leading-relaxed text-(--a42-text-muted)'>
						{description}
					</div>
				) : null}
			</div>
			{actions ? (
				<div className='flex shrink-0 flex-wrap items-center gap-2 md:justify-end'>{actions}</div>
			) : null}
		</header>
	);
}

/** Primary / secondary actions for recruiter headers (Stripe-style pill + outline). */
export function RecruiterHeaderActions({ children }: { children: ReactNode }) {
	return <div className='flex flex-wrap items-center gap-2'>{children}</div>;
}

export function RecruiterPrimaryLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className='inline-flex items-center justify-center rounded-lg bg-(--a42-accent) px-4 py-2.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-(--a42-accent-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--a42-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--a42-bg)'
		>
			{children}
		</Link>
	);
}

export function RecruiterSecondaryLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className='inline-flex items-center justify-center rounded-lg border border-(--a42-border-strong) bg-(--a42-surface) px-4 py-2.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-(--a42-text) shadow-sm transition-colors hover:border-(--a42-text-faint) hover:bg-(--a42-surface-2) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--a42-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--a42-bg)'
		>
			{children}
		</Link>
	);
}

export function RecruiterCard({
	children,
	className,
	padding = 'md',
}: {
	children: ReactNode;
	className?: string;
	padding?: 'none' | 'sm' | 'md' | 'lg';
}) {
	const pad = {
		none: '',
		sm: 'p-4',
		md: 'p-5 md:p-6',
		lg: 'p-6 md:p-8',
	}[padding];
	return (
		<div
			className={cn(
				'rounded-2xl border border-(--a42-border) bg-(--a42-surface)',
				CARD_SHADOW,
				pad,
				className,
			)}
		>
			{children}
		</div>
	);
}

export function RecruiterSkeletonLine({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'h-4 animate-pulse rounded-md bg-(--a42-surface-2)',
				className,
			)}
		/>
	);
}
