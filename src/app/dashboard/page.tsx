import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { log } from '@/lib/print-helpers';
import { SignOutButton } from '@/components/auth/SignOutBtn';

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  log('[session from dashboard page]: \n', session);

  if (!session) {
    redirect('/auth');
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default Page;
