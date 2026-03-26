import type { Metadata } from 'next';
import Header from '@/components/layout/navigation/Header';
import Home from './(pages)/home/page';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
	title: 'Skills, not CVs',
	description:
		'The hiring marketplace built exclusively for 42 students. Prove what you can do with custom technical challenges.',
};

export default function Page() {
	return (
		<>
			<Header />
			<Home />
			<Footer />
		</>
	);
}
