import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { AuthBrandAside } from '@/components/auth/auth-brand-aside';
import { SignUpFlow } from '@/components/auth/sign-up-flow';

type PageProps = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'metadata' });
	return {
		title: t('signUpTitle'),
		description: t('signUpDescription'),
	};
}

export default async function Page({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('authBrand');

	return (
		<section className='flex min-h-screen flex-col md:flex-row'>
			<AuthBrandAside tagline={t('signUpTagline')} />
			<div className='flex flex-1 flex-col items-center justify-center bg-[var(--a42-bg)] px-4 py-16 md:min-h-screen md:px-8'>
				<SignUpFlow />
			</div>
		</section>
	);
}
