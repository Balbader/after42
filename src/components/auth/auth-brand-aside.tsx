import { Link } from '@/i18n/navigation';

type AuthBrandAsideProps = {
	tagline: string;
};

/**
 * Dark editorial panel for sign-in / sign-up (matches homepage CTA band + Fraunces wordmark).
 * "42" uses fixed dark-surface accent (#EA580C) so it reads on #1C1917 in both themes.
 */
export function AuthBrandAside({ tagline }: AuthBrandAsideProps) {
	return (
		<div className='relative hidden flex-1 flex-col items-center justify-center bg-[#1C1917] px-8 py-16 md:flex'>
			<div className='flex max-w-sm flex-col items-center text-center'>
				<Link
					href='/'
					className='rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1917]'
				>
					<span className='font-(family-name:--font-fraunces) text-3xl font-medium tracking-[-0.02em] text-[#FAFAF8] sm:text-4xl'>
						after
						<span className='text-[#EA580C]'>42</span>
					</span>
				</Link>
				<p className='mt-6 font-(family-name:--font-fraunces) text-lg font-light italic leading-snug text-[#A8A29E]'>
					{tagline}
				</p>
			</div>
		</div>
	);
}
