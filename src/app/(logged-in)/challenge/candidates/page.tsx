import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Candidates | after42',
	description: 'Review candidates for your challenges',
};

export default function CandidatesPage() {
	return (
		<div className='w-full min-w-0'>
			<h1>Candidates</h1>
		</div>
	);
}
