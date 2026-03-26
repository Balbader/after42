import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Header from '@/components/layout/navigation/Header';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
	title: 'Forgot password',
	description: 'Reset your after42 account password.',
};

export default function ForgotPasswordPage() {
	return (
		<>
			<Header />
			<div className='container mx-auto flex h-screen flex-col items-center justify-center bg-[var(--a42-bg)] px-4'>
				<ForgotPasswordForm />
			</div>
			<Footer />
		</>
	);
}
