import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Footer from '@/components/layout/navigation/Footer';
import Header from '@/components/layout/navigation/Header';

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'metadata' });
	return {
		title: t('forgotPasswordTitle'),
		description: t('forgotPasswordDescription'),
	};
}

export default async function ForgotPasswordPage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Header />
			<div className='container mx-auto flex h-screen flex-col items-center justify-center bg-[var(--a42-bg)] px-4'>
				<ForgotPasswordForm />
			</div>
			<Footer />
		</>
	);
}
