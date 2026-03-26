import { headers } from 'next/headers';
import { enUS, fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { authController } from '@/bff/controllers/auth.controller';
import type { User } from '@/bff/models/user.model';
import { SectionLabel, SectionTitle } from '@/components/company/ui';

type PageProps = {
	params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('profile');
	const { user } = await authController.requireSession(await headers());
	const u = user as User & { createdAt?: string | Date | null };

	const dateLocale = locale === 'fr' ? fr : enUS;
	const memberSince = u.createdAt
		? format(new Date(u.createdAt), 'MMMM yyyy', { locale: dateLocale })
		: '—';

	const roleLabel =
		u.role === 'recruiter' ? t('recruiter') : t('candidate');

	return (
		<div className='mx-auto w-full max-w-2xl px-4 pt-8'>
			<SectionLabel>{t('label')}</SectionLabel>
			<SectionTitle className='mt-2'>{t('title')}</SectionTitle>

			<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
				<dl className='space-y-4'>
					<ProfileField label={t('name')} value={u.name ?? ''} />
					<ProfileField label={t('email')} value={u.email} />
					<ProfileField label={t('role')} value={roleLabel} />
					<ProfileField label={t('memberSince')} value={memberSince} />
				</dl>
			</div>
		</div>
	);
}

function ProfileField({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
				{label}
			</dt>
			<dd className='mt-0.5 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
				{value}
			</dd>
		</div>
	);
}
