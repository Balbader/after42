import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Challenges | after42',
	description: 'View and manage your coding challenges',
};

export default async function ChallengesDashboardPage() {
	return (
		<div className='w-full min-w-0'>
			<h1>Challenges Dashboard</h1>
		</div>
	);
}
