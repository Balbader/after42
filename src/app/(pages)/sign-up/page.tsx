import type { Metadata } from 'next';

import { AuthBrandAside } from '@/components/auth/auth-brand-aside';
import { SignUpFlow } from '@/components/auth/sign-up-flow';

export const metadata: Metadata = {
	title: 'Sign up',
	description: 'Create your after42 account.',
};

export default function Page() {
	return (
		<section className='flex min-h-screen flex-col md:flex-row'>
			<AuthBrandAside tagline='Your code is the application.' />
			<div className='flex flex-1 flex-col items-center justify-center bg-[var(--a42-bg)] px-4 py-16 md:min-h-screen md:px-8'>
				<SignUpFlow />
			</div>
		</section>
	);
}
