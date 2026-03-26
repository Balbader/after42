import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
	title: 'Company Profile — after42',
	description: 'View and manage your company profile.',
};

import { requireRole } from '@/lib/require-role';
import {
	RecruiterCard,
	RecruiterPage,
	RecruiterPageHeader,
} from '@/components/company';

type PageProps = { params: Promise<{ locale: string }> };

export default async function CompanyProfilePage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('company');

	await requireRole('recruiter');

	return (
		<RecruiterPage>
			<RecruiterPageHeader
				eyebrow={t('companyProfileEyebrow')}
				title={t('companyProfileTitle')}
				description={t('companyProfileLead')}
			/>

			<RecruiterCard className='mt-8'>
				<form className='space-y-5'>
					<div>
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
							{t('companyName')}
						</label>
						<input
							type='text'
							readOnly
							className='w-full cursor-not-allowed rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface-2)] px-3 py-2.5 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'
							placeholder='e.g. TechCorp'
						/>
					</div>
					<div>
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
							{t('companyDescription')}
						</label>
						<textarea
							readOnly
							rows={4}
							className='w-full cursor-not-allowed resize-none rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface-2)] px-3 py-2.5 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'
							placeholder='Tell candidates what your company does...'
						/>
					</div>
					<button
						type='button'
						disabled
						className='rounded-lg bg-[var(--a42-accent)] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white opacity-40'
					>
						{t('saveChanges')}
					</button>
					<p className='font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-faint)]'>
						{t('companyProfileSoon')}
					</p>
				</form>
			</RecruiterCard>
		</RecruiterPage>
	);
}
