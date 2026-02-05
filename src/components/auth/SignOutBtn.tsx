'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';
import { message } from '@/lib/print-helpers';

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    message('Signing out...');

    toast.success('Signed out successfully');
    router.push('/');
    router.refresh();
  };

  return (
    <Button onClick={handleSignOut} variant='outline' className='mt-4'>
      <LogOutIcon className='size-3' />
      <span className=' '>Log out</span>
    </Button>
  );
};
