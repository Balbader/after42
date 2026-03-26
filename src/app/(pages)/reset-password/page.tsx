import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
	title: 'Reset password',
	description: 'Set a new password for your after42 account.',
};

function ResetPasswordLoading() {
	return (
		<Card className='w-full border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-sm sm:max-w-md'>
			<CardHeader className='text-center'>
				<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
					Reset password
				</CardTitle>
				<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
					Loading…
				</CardDescription>
			</CardHeader>
			<CardContent className='flex items-center justify-center py-8'>
				<Loader2 className='size-8 animate-spin text-[var(--a42-text-muted)]' />
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className='container mx-auto flex h-screen flex-col items-center justify-center bg-[var(--a42-bg)] px-4'>
			<Suspense fallback={<ResetPasswordLoading />}>
				<ResetPasswordForm />
			</Suspense>
		</div>
	);
}
