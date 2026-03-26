import { useTranslations } from 'next-intl';

export function VisionSection() {
	const t = useTranslations('home');

	return (
		<section
			className='px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
			aria-labelledby='vision-heading'
		>
			<div className='mx-auto max-w-[1200px]'>
				<div className='home-reveal-block mx-auto max-w-3xl border-l-2 border-[var(--a42-accent)] bg-[var(--a42-surface)] py-8 pl-6 pr-6 sm:py-10 sm:pl-10 sm:pr-10 lg:pl-12'>
					<p
						id='vision-heading'
						className='font-(family-name:--font-fraunces) text-xl leading-snug font-normal italic text-[var(--a42-text)] sm:text-2xl lg:text-[1.75rem] lg:leading-relaxed'
					>
						{t('visionQuote')}
					</p>
					<p className='mt-6 font-(family-name:--font-dm-sans) text-[12px] font-medium tracking-[0.04em] text-[var(--a42-text-faint)] uppercase'>
						{t('visionEyebrow')}
					</p>
				</div>
			</div>
		</section>
	);
}
