import Link from 'next/link';
import { ModeToggle } from '@/components/dark-mode-toggle';

export default function Header() {
	return (
		<header className='sticky top-0 z-50 w-full border-b border-[var(--a42-border)] bg-[var(--a42-surface)]'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<nav
					className='flex w-full items-center justify-between gap-2'
					aria-label='Main navigation'
				>
					<div className='flex items-center'>
						<Link
							href='/'
							className='rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a42-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--a42-surface)]'
						>
							<span className='font-(family-name:--font-fraunces) text-[1.375rem] font-medium tracking-[-0.02em] text-[var(--a42-text)]'>
								after42
							</span>
						</Link>
					</div>
					<div className='flex items-center gap-3'>
						<Link
							href='/sign-in'
							className='inline-flex min-h-[44px] items-center font-(family-name:--font-dm-sans) text-[13px] text-[var(--a42-text-muted)] transition-colors hover:text-[var(--a42-text)]'
						>
							Sign in
						</Link>
						<Link
							href='/sign-up'
							className='rounded-md bg-[var(--a42-accent)] px-4 py-1.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)]'
						>
							Sign up
						</Link>
						<ModeToggle />
					</div>
				</nav>
			</div>
		</header>
	);
}
