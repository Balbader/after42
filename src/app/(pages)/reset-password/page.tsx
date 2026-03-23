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
	title: 'Reset Password | Oto',
	description: 'Set a new password for your account',
};

function ResetPasswordLoading() {
	return (
		<Card className='w-full sm:max-w-md'>
			<CardHeader className='text-center'>
				<CardTitle className='text-xl'>Reset Password</CardTitle>
				<CardDescription>Loading...</CardDescription>
			</CardHeader>
			<CardContent className='flex items-center justify-center py-8'>
				<Loader2 className='size-8 animate-spin text-muted-foreground' />
			</CardContent>
		</Card>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className='container mx-auto flex flex-col items-center justify-center h-screen'>
			<Suspense fallback={<ResetPasswordLoading />}>
				<ResetPasswordForm />
			</Suspense>
		</div>
	);
}
