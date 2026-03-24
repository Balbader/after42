import type { Metadata } from 'next';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';

export const metadata: Metadata = {
	title: 'Create Challenge | after42',
	description: 'Upload a job post to generate a coding challenge',
};

export default async function CreateChallengePage() {
	const { user } = await authController.requireSession(await headers());

	return (
		<div className='w-full min-w-0'>
			<JobPostUploader recruiterId={user?.id ?? ''} />
		</div>
	);
}
