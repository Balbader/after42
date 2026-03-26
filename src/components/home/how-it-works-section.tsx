import { useTranslations } from 'next-intl';
import { Upload, Wand2, GitBranch } from 'lucide-react';

const stepIcons = [Upload, Wand2, GitBranch] as const;
const stepNums = ['01', '02', '03'] as const;
const stepTitleKeys = ['step1Title', 'step2Title', 'step3Title'] as const;
const stepBodyKeys = ['step1Body', 'step2Body', 'step3Body'] as const;

export function HowItWorksSection() {
	const t = useTranslations('home');

	return (
		<section
			className='border-b border-[var(--a42-border)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
			aria-labelledby='how-heading'
		>
			<div className='mx-auto max-w-[1200px]'>
				<div className='home-reveal-block'>
					<h2
						id='how-heading'
						className='font-(family-name:--font-fraunces) text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-[2rem]'
					>
						{t('stepsTitle')}
					</h2>
					<p className='mt-3 max-w-xl font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-base'>
						{t('stepsLead')}
					</p>
				</div>

				<div className='home-reveal-stagger mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3'>
					{stepNums.map((n, i) => {
						const Icon = stepIcons[i];
						const titleKey = stepTitleKeys[i];
						const bodyKey = stepBodyKeys[i];
						return (
							<article
								key={n}
								className='home-reveal-item group rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-6 transition-colors duration-150 hover:border-[var(--a42-border-strong)] hover:bg-[var(--a42-surface-2)] sm:p-8'
							>
								<div className='flex items-start justify-between gap-4'>
									<span className='font-(family-name:--font-fraunces) text-3xl font-light tabular-nums text-[var(--a42-border-strong)] transition-colors group-hover:text-[var(--a42-text-faint)]'>
										{n}
									</span>
									<span className='flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-bg)] text-[var(--a42-accent)]'>
										<Icon className='size-5' strokeWidth={1.75} aria-hidden />
									</span>
								</div>
								<h3 className='mt-6 font-(family-name:--font-dm-sans) text-base font-medium text-[var(--a42-text)]'>
									{t(titleKey)}
								</h3>
								<p className='mt-2 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)]'>
									{t(bodyKey)}
								</p>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
