import type { Metadata } from 'next';

import { AuthBrandAside } from '@/components/auth/auth-brand-aside';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata: Metadata = {
	title: 'Sign in',
	description: 'Sign in to your after42 account.',
};

export default function Page() {
	return (
		<section className='flex min-h-screen flex-col md:flex-row'>
			<AuthBrandAside tagline='Skills, not CVs.' />
			<div className='flex flex-1 flex-col items-center justify-center bg-[var(--a42-bg)] px-4 py-16 md:min-h-screen md:px-8'>
				<SignInForm />
			</div>
		</section>
	);
}
