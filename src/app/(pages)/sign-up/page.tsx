import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';

import { SignUpFlow } from '@/components/auth/sign-up-flow';

const dmSans = DM_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
});

const fraunces = Fraunces({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
	title: 'AFTER-42 | Sign Up',
	description: 'Create your account',
};

export default function Page() {
	return (
		<section
			className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8 ${dmSans.className}`}
		>
			<SignUpFlow titleClassName={fraunces.className} />
		</section>
	);
}
