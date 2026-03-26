import Image from 'next/image';
import Link from 'next/link';
import after42Logo from '../../../../public/binary-code.png';

export default function Footer() {
	return (
		<footer className='bottom-0 z-50 w-full border-t border-[var(--a42-border)] bg-[var(--a42-surface)]'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center gap-2'>
					<Link
						href='/'
						className='flex items-center gap-2 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a42-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--a42-surface)]'
					>
						<Image
							src={after42Logo}
							alt='After42'
							width={50}
							height={50}
							priority
						/>
					</Link>
				</div>
				<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
					&copy; 2026 After42. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
