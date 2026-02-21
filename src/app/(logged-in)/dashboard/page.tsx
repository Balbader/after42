import { authController } from '@/bff/controllers/auth.controller';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const { user } = await authController.requireSession(await headers());

  return (
    <div className='w-full min-w-0'>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
