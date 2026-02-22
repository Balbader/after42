import { JobPostUploader } from '@/components/job-post-uploader';
import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';
import { log } from '@/lib/log-helpers';

export default async function CreateChallengePage() {
  const { user } = await authController.requireSession(await headers());
  log('CreateChallengePage', user);

  return (
    <div className='w-full min-w-0'>
      <JobPostUploader recruiterId={user?.id ?? ''} />
    </div>
  );
}
