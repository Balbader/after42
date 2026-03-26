import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { authController } from '@/bff/controllers/auth.controller';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { SectionLabel, SectionTitle } from '@/components/company/ui';

export const metadata: Metadata = {
	title: 'Create Challenge | after42',
	description: 'Upload a job post to generate a coding challenge',
};

export default async function CreateChallengePage() {
	const { user } = await authController.requireSession(await headers());

	return (
		<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
			<SectionLabel>New challenge</SectionLabel>
			<SectionTitle className='mt-2'>Upload a job post</SectionTitle>
			<p className='mt-1 mb-6 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				Upload a PDF, Word, or plain-text job description. AI extracts the role,
				stack, and requirements — then generates a custom coding challenge.
			</p>
			<JobPostUploader recruiterId={user?.id ?? ''} />
		</div>
	);
}
