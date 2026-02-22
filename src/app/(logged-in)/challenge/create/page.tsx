import { JobPostUploader } from '@/components/job-post-uploader';
import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';
import { JobPostList } from '@/components/job-post-list';

export default async function CreateChallengePage() {
  const { user } = await authController.requireSession(await headers());

  return (
    <div className='w-full min-w-0'>
      <JobPostUploader recruiterId={user?.id ?? ''} />
      <JobPostList recruiterId={user?.id ?? ''} />
    </div>
  );
}
