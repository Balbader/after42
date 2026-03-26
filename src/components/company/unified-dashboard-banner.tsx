'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function UnifiedDashboardBanner({ tab }: { tab: 'challenges' | 'review' }) {
	const t = useTranslations('company');
	const href = tab === 'challenges' ? '/dashboard?tab=challenges' : '/dashboard?tab=review';

	return (
		<div className='mb-6 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3'>
			<p className='font-(family-name:--font-dm-sans) text-[13px] leading-relaxed text-[#57534E]'>
				<span className='mr-1' aria-hidden>
					💡
				</span>
				{t('unifiedDashboardBanner')}{' '}
				<Link href={href} className='font-medium text-[#C2410C] hover:underline'>
					{t('unifiedDashboardCta')}
				</Link>
			</p>
		</div>
	);
}
