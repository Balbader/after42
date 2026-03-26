import { useTranslations } from 'next-intl';
import { Building2, UserRound } from 'lucide-react';

export function BothSidesSection() {
	const t = useTranslations('home');

	return (
		<section
			className='border-b border-[var(--a42-border)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
			aria-labelledby='both-heading'
		>
			<div className='mx-auto max-w-[1200px]'>
				<div className='home-reveal-block'>
					<h2
						id='both-heading'
						className='font-(family-name:--font-fraunces) text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-[2rem]'
					>
						{t('bothTitle')}
					</h2>
					<p className='mt-3 max-w-xl font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)] sm:text-base'>
						{t('bothLead')}
					</p>
				</div>

				<div className='mt-12 grid gap-4 md:grid-cols-2 md:gap-5'>
					<article className='home-reveal-block rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-8 sm:p-10'>
						<div className='flex size-11 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-accent-light)] text-[var(--a42-accent)]'>
							<Building2 className='size-5' strokeWidth={1.75} aria-hidden />
						</div>
						<h3 className='mt-6 font-(family-name:--font-dm-sans) text-lg font-semibold text-[var(--a42-text)]'>
							{t('forCompaniesTitle')}
						</h3>
						<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-[15px]'>
							{t('forCompaniesBody')}
						</p>
					</article>
					<article className='home-reveal-block rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-8 sm:p-10'>
						<div className='flex size-11 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface-2)] text-[var(--a42-text)]'>
							<UserRound className='size-5' strokeWidth={1.75} aria-hidden />
						</div>
						<h3 className='mt-6 font-(family-name:--font-dm-sans) text-lg font-semibold text-[var(--a42-text)]'>
							{t('forDevelopersTitle')}
						</h3>
						<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-[15px]'>
							{t('forDevelopersBody')}
						</p>
					</article>
				</div>
			</div>
		</section>
	);
}
