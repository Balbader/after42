'use client';

import { useTranslations } from 'next-intl';
import { LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

import { signOutAction } from '@/app/actions/auth';
import { useRouter } from '@/i18n/navigation';
import { Button } from '../ui/button';

export function SignOutButton() {
	const router = useRouter();
	const t = useTranslations('authSignOut');

	const handleSignOut = async () => {
		try {
			await toast
				.promise(
					(async () => {
						const result = await signOutAction();
						if (!result.success) {
							throw new Error(t('toastError'));
						}
					})(),
					{
						loading: t('toastSigningOut'),
						success: t('toastSuccess'),
						error: (err) =>
							err instanceof Error ? err.message : t('toastError'),
					},
				)
				.unwrap();
			router.push('/');
			router.refresh();
		} catch {
			// Error toast already shown by toast.promise
		}
	};

	return (
		<Button onClick={handleSignOut} variant='outline' className='mt-4'>
			<LogOutIcon className='size-3' />
			<span className=' '>Log out</span>
		</Button>
	);
}
