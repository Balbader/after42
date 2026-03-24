import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata: Metadata = {
	title: 'AFTER-42 | Sign Up',
	description: 'Create your account',
};

export default function Page() {
	return (
		<section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8'>
			<SignUpForm />
		</section>
	);
}
