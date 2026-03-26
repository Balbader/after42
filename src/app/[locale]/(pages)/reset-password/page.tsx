import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

import { ResetPasswordLoading } from './reset-password-loading';

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'metadata' });
	return {
		title: t('resetPasswordTitle'),
		description: t('resetPasswordDescription'),
	};
}

export default async function ResetPasswordPage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className='container mx-auto flex h-screen flex-col items-center justify-center bg-[var(--a42-bg)] px-4'>
			<Suspense fallback={<ResetPasswordLoading />}>
				<ResetPasswordForm />
			</Suspense>
		</div>
	);
}
