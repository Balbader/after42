import type { Metadata } from 'next';
import Image from 'next/image';

import { SignInForm } from '@/components/auth/sign-in-form';
import after42Logo from '../../../../public/binary-code.png';

export const metadata: Metadata = {
	title: 'AFTER-42 | Sign In',
	description: 'Sign in to your account',
};

export default function Page() {
	return (
		<section className='flex min-h-screen flex-col md:flex-row'>
			<div className='relative hidden flex-1 flex-col items-center justify-center bg-[#1C1917] px-8 py-16 md:flex'>
				<div className='flex max-w-sm flex-col items-center text-center'>
					<Image
						src={after42Logo}
						alt=''
						width={64}
						height={64}
						className='brightness-0 invert'
						priority
					/>
					<p className='mt-6 font-(family-name:--font-fraunces) text-2xl text-[#FAFAF8]'>
						after42
					</p>
					<p className='mt-4 font-(family-name:--font-fraunces) text-lg font-light italic text-[#A8A29E]'>
						Skills, not CVs.
					</p>
				</div>
			</div>
			<div className='flex flex-1 flex-col items-center justify-center bg-[#FAFAF8] px-4 py-16 md:min-h-screen md:px-8'>
				<SignInForm />
			</div>
		</section>
	);
}
