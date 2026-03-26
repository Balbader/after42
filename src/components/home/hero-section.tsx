import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function HeroSection() {
	const t = useTranslations('home');

	return (
		<section
			className='relative overflow-hidden border-b border-[var(--a42-border)] bg-[var(--a42-surface)]'
			aria-labelledby='hero-heading'
		>
			<div
				className='pointer-events-none absolute inset-0 opacity-[0.45]'
				aria-hidden
			>
				<div className='absolute -top-24 right-0 h-[min(520px,70vw)] w-[min(520px,90vw)] rounded-full bg-[var(--a42-accent-light)] blur-3xl' />
				<div className='absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-[var(--a42-surface-2)] blur-3xl' />
			</div>

			<div className='relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:py-28'>
				<div className='grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:gap-16'>
					<div className='max-w-2xl'>
						<p
							className={cn(
								'home-hero-anim font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.08em] text-[var(--a42-text-muted)] uppercase',
							)}
						>
							{t('heroEyebrow')}
						</p>
						<h1
							id='hero-heading'
							className={cn(
								'home-hero-anim mt-4 font-(family-name:--font-fraunces) text-[2.5rem] leading-[1.08] font-normal tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]',
							)}
						>
							{t('heroTitle')}
						</h1>
						<p
							className={cn(
								'home-hero-anim mt-5 font-(family-name:--font-dm-sans) text-base leading-relaxed text-[var(--a42-text-muted)] sm:text-lg',
							)}
						>
							{t('heroBody')}
						</p>
						<div className='home-hero-anim mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
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
								className='h-11 rounded-md border-[var(--a42-border)] bg-transparent font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)] shadow-none hover:border-[var(--a42-border-strong)] hover:bg-[var(--a42-surface-2)]'
							>
								<Link href='/sign-in' className='inline-flex items-center gap-2'>
									{t('ctaHiring')}
									<ArrowRight className='size-4' aria-hidden />
								</Link>
							</Button>
						</div>
					</div>

					<div className='home-hero-preview relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none'>
						<div className='home-hero-preview-inner'>
							<div
								className='rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-5 shadow-[0_24px_48px_-12px_rgba(28,25,23,0.12)] sm:p-6'
								aria-hidden
							>
								<div className='flex items-center justify-between gap-3 border-b border-[var(--a42-border)] pb-4'>
									<span className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
										{t('previewBlindReview')}
									</span>
									<span className='rounded-full bg-[var(--a42-surface-2)] px-2.5 py-0.5 font-(family-name:--font-mono) text-[10px] font-medium text-[var(--a42-text-muted)]'>
										{t('previewLive')}
									</span>
								</div>
								<div className='pt-5'>
									<p className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
										{t('previewCandidate')}
									</p>
									<div className='mt-4 flex flex-wrap items-end gap-3'>
										<span className='font-(family-name:--font-fraunces) text-4xl font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-5xl'>
											91
										</span>
										<span className='pb-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
											{t('previewScoreSuffix')}
										</span>
										<span
											className='mb-1 inline-flex items-center rounded-full border border-[var(--a42-score-high)] bg-[var(--a42-score-high-bg)] px-3 py-1 font-(family-name:--font-dm-sans) text-xs font-medium text-[var(--a42-score-high)]'
										>
											{t('previewRecommend')}
										</span>
									</div>
									<p className='mt-5 font-(family-name:--font-dm-sans) text-xs leading-relaxed text-[var(--a42-text-muted)]'>
										{t('previewCaption')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
