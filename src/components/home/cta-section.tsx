import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function CtaSection() {
	const t = useTranslations('home');

	return (
		<section
			className='home-cta-section border-t border-[#44403C] bg-[#1C1917] px-4 py-20 sm:px-6 sm:py-24 lg:px-8'
			aria-labelledby='cta-heading'
		>
			<div className='home-cta-inner mx-auto max-w-[1200px] text-center'>
				<h2
					id='cta-heading'
					className='font-(family-name:--font-fraunces) text-[2rem] font-normal tracking-[-0.02em] text-[#FAFAF8] sm:text-4xl'
				>
					{t('ctaTitle')}
				</h2>
				<p className='mx-auto mt-4 max-w-lg font-(family-name:--font-dm-sans) text-base text-[#A8A29E]'>
					{t('ctaLead')}
				</p>
				<div className='mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
					<Button
						asChild
						size='lg'
						className='h-11 rounded-md bg-[var(--a42-accent)] px-6 font-(family-name:--font-dm-sans) text-sm font-medium text-white shadow-none hover:bg-[var(--a42-accent-hover)]'
					>
						<Link href='/sign-up'>{t('ctaDeveloper')}</Link>
					</Button>
					<Button
						asChild
						variant='outline'
						size='lg'
						className='h-11 rounded-md border-[#57534E] bg-transparent font-(family-name:--font-dm-sans) text-sm font-medium text-[#FAFAF8] shadow-none hover:border-[#A8A29E] hover:bg-white/5'
					>
						<Link href='/sign-in' className='inline-flex items-center gap-2'>
							{t('ctaHiring')}
							<ArrowRight className='size-4' aria-hidden />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
