import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'All Candidates — after42',
	description: 'View and filter all candidate submissions across your challenges.',
};

export default function CandidatesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
