import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='bottom-0 z-50 w-full border-t border-[var(--a42-border)] bg-[var(--a42-surface)]'>
			<div className='container mx-auto flex h-16 flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8'>
				<Link
					href='/'
					className='rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a42-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--a42-surface)]'
				>
					<span className='font-(family-name:--font-fraunces) text-[1.125rem] font-medium tracking-[-0.02em] text-[var(--a42-text)]'>
						after42
					</span>
				</Link>
				<p className='font-(family-name:--font-dm-sans) text-[12px] tracking-[0.01em] text-[var(--a42-text-muted)]'>
					&copy; 2026 after42. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
