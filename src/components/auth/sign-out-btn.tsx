'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { signOutAction } from '@/app/actions/auth';
import { toast } from 'sonner';
import { LogOutIcon } from 'lucide-react';

export function SignOutButton() {
	const router = useRouter();

	const handleSignOut = async () => {
		const result = await signOutAction();

		if (!result.success) {
			toast.error('Failed to sign out');
		} else {
			toast.success('Signed out successfully');
			// Use router.push for client-side navigation
			router.push('/');
			// Force a refresh to clear any cached data
			router.refresh();
		}
	};

	return (
		<Button onClick={handleSignOut} variant='outline' className='mt-4'>
			<LogOutIcon className='size-3' />
			<span className=' '>Log out</span>
		</Button>
	);
}
