import type { Metadata } from 'next';

import HomePage from '@/components/home/home-page';

export const metadata: Metadata = {
	title: 'after42 — AI-Powered Technical Hiring',
	description:
		'Upload a job post, generate a coding challenge, and evaluate candidates with blind AI-scored reviews.',
};

export default function Home() {
	return <HomePage />;
}
