import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Footer from '@/components/layout/navigation/Footer';
import Header from '@/components/layout/navigation/Header';
import Home from './(pages)/home/page';

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'metadata' });
	return {
		title: t('homeTitle'),
		description: t('homeDescription'),
	};
}

export default async function Page({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Header />
			<Home />
			<Footer />
		</>
	);
}
