import Link from 'next/link';
import Image from 'next/image';
import after42Logo from '../../../../public/binary-code.png';
import { ModeToggle } from '@/components/dark-mode-toggle';

export default function Header() {
	return (
		<header className='sticky top-0 z-50 w-full border-b border-[#E7E5E4] bg-[#FFFFFF]'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<nav
					className='flex w-full items-center justify-between gap-2'
					aria-label='Main navigation'
				>
					<div className='flex items-center gap-2'>
						<Link
							href='/'
							className='flex items-center gap-2 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2'
						>
							<Image
								src={after42Logo}
								alt='After42'
								width={32}
								height={32}
								priority
							/>
							<span className='font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917]'>
								after42
							</span>
						</Link>
					</div>
					<div className='flex items-center gap-3'>
						<Link
							href='/sign-in'
							className='inline-flex min-h-[44px] items-center font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] transition-colors hover:text-[#1C1917]'
						>
							Sign in
						</Link>
						<Link
							href='/sign-up'
							className='rounded-md bg-[#C2410C] px-4 py-1.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-white transition-colors hover:bg-[#9A3412]'
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
