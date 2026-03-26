'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function UnifiedDashboardBanner({ tab }: { tab: 'challenges' | 'review' }) {
	const t = useTranslations('company');
	const href = tab === 'challenges' ? '/dashboard?tab=challenges' : '/dashboard?tab=review';

	return (
		<div className='mb-6 rounded-xl border border-amber-200/90 bg-[var(--a42-accent-light)] px-4 py-3 dark:border-amber-800/60'>
			<p className='font-(family-name:--font-dm-sans) text-[13px] leading-relaxed text-[var(--a42-text-muted)]'>
				<span className='mr-1' aria-hidden>
					💡
				</span>
				{t('unifiedDashboardBanner')}{' '}
				<Link href={href} className='font-medium text-[var(--a42-accent)] hover:underline'>
					{t('unifiedDashboardCta')}
				</Link>
			</p>
		</div>
	);
}
