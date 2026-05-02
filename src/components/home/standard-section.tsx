import { useTranslations } from 'next-intl';
import { Compass, ShieldCheck, Sparkles, Gauge } from 'lucide-react';

const categoryIcons = [Compass, ShieldCheck, Sparkles, Gauge] as const;
const categoryTitleKeys = [
	'standardCategory1Title',
	'standardCategory2Title',
	'standardCategory3Title',
	'standardCategory4Title',
] as const;
const categoryBodyKeys = [
	'standardCategory1Body',
	'standardCategory2Body',
	'standardCategory3Body',
	'standardCategory4Body',
] as const;

export function StandardSection() {
	const t = useTranslations('home');

	return (
		<section
			className='border-b border-[var(--a42-border)] bg-[var(--a42-surface)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
			aria-labelledby='standard-heading'
		>
			<div className='mx-auto max-w-[1200px]'>
				<div className='home-reveal-block max-w-2xl'>
					<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.08em] text-[var(--a42-accent)] uppercase'>
						{t('standardEyebrow')}
					</p>
					<h2
						id='standard-heading'
						className='mt-3 font-(family-name:--font-fraunces) text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-[2rem]'
					>
						{t('standardTitle')}
					</h2>
					<p className='mt-4 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-base'>
						{t('standardLead')}
					</p>
				</div>

				<div className='home-reveal-stagger mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4'>
					{categoryTitleKeys.map((titleKey, i) => {
						const Icon = categoryIcons[i];
						const bodyKey = categoryBodyKeys[i];
						return (
							<article
								key={titleKey}
								className='home-reveal-item rounded-lg border border-[var(--a42-border)] bg-[var(--a42-bg)] p-5 sm:p-6'
							>
								<span className='flex size-9 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface)] text-[var(--a42-accent)]'>
									<Icon className='size-4' strokeWidth={1.75} aria-hidden />
								</span>
								<h3 className='mt-4 font-(family-name:--font-dm-sans) text-sm font-semibold text-[var(--a42-text)]'>
									{t(titleKey)}
								</h3>
								<p className='mt-2 font-(family-name:--font-dm-sans) text-[13px] leading-relaxed text-[var(--a42-text-muted)]'>
									{t(bodyKey)}
								</p>
							</article>
						);
					})}
				</div>

				<div className='home-reveal-block mt-10'>
					<p className='font-(family-name:--font-dm-sans) text-xs italic text-[var(--a42-text-faint)]'>
						{t('standardCtaNote')}
					</p>
				</div>
			</div>
		</section>
	);
}
