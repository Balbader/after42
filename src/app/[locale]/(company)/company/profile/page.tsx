import { getTranslations, setRequestLocale } from 'next-intl/server';

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
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
							{t('companyName')}
						</label>
						<input
							type='text'
							readOnly
							className='w-full cursor-not-allowed rounded-lg border border-[#E7E5E4] bg-[#F5F4F1] px-3 py-2.5 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'
							placeholder='e.g. TechCorp'
						/>
					</div>
					<div>
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
							{t('companyDescription')}
						</label>
						<textarea
							readOnly
							rows={4}
							className='w-full cursor-not-allowed resize-none rounded-lg border border-[#E7E5E4] bg-[#F5F4F1] px-3 py-2.5 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'
							placeholder='Tell candidates what your company does...'
						/>
					</div>
					<button
						type='button'
						disabled
						className='rounded-lg bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white opacity-40'
					>
						{t('saveChanges')}
					</button>
					<p className='font-(family-name:--font-dm-sans) text-xs text-[#A8A29E]'>
						{t('companyProfileSoon')}
					</p>
				</form>
			</RecruiterCard>
		</RecruiterPage>
	);
}
