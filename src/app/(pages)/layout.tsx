import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/layout/navigation/Header';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
	description:
		'Blind technical hiring for the 42 network — challenges, blind review, and AI interview guides.',
};

export default function PagesLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
