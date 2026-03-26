import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Footer from '@/components/layout/navigation/Footer';
import Header from '@/components/layout/navigation/Header';

type Props = Readonly<{
	children: ReactNode;
	params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'metadata' });
	return {
		description: t('pagesDescription'),
	};
}

export default async function PagesLayout({ children, params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
