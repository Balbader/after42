import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';

export default async function CreateChallengePage() {
	const { user } = await authController.requireSession(await headers());

	return (
		<div className='w-full min-w-0'>
			<JobPostUploader recruiterId={user?.id ?? ''} />
		</div>
	);
}
