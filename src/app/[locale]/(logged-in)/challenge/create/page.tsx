import type { Metadata } from 'next';

import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { SectionLabel, SectionTitle } from '@/components/company/ui';
import { requireRole } from '@/lib/require-role';

export const metadata: Metadata = {
	title: 'Create Challenge | after42',
	description: 'Upload a job post to generate a coding challenge',
};

export default async function CreateChallengePage() {
	await requireRole('recruiter');

	return (
		<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
			<SectionLabel>New challenge</SectionLabel>
			<SectionTitle className='mt-2'>Upload a job post</SectionTitle>
			<p className='mt-1 mb-6 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				Upload a PDF, Word, or plain-text job description. AI extracts the role,
				stack, and requirements — then generates a custom coding challenge.
			</p>
			<JobPostUploader />
		</div>
	);
}
