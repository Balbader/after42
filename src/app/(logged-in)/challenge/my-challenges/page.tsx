import { JobPostList } from '@/components/job-post/JobPostList';
import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';

export default async function MyChallengesPage() {
  const { user } = await authController.requireSession(await headers());

  return (
    <div className='w-full min-w-0'>
      <h1>Challenges Dashboard</h1>
      <JobPostList recruiterId={user?.id ?? ''} />
    </div>
  );
}
