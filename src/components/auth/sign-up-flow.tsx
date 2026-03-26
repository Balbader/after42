'use client';

import * as React from 'react';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { cn } from '@/lib/utils';

type Role = 'recruiter' | 'candidate';

type SignUpFlowProps = {
	titleClassName?: string;
};

export function SignUpFlow({ titleClassName }: SignUpFlowProps) {
	const [step, setStep] = React.useState<'role' | 'form'>('role');
	const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);

	if (step === 'form' && selectedRole) {
		return (
			<SignUpForm initialRole={selectedRole} hideRoleSelect />
		);
	}

	return (
		<div className='mx-auto flex w-full max-w-3xl flex-col gap-8'>
			<div className='text-center'>
				<h1
					className={cn(
						'font-(family-name:--font-fraunces) text-2xl font-normal tracking-[-0.02em] text-[#1C1917] sm:text-[28px]',
						titleClassName,
					)}
				>
					How will you use after42?
				</h1>
				<p className='mt-2 text-sm text-[#78716C]'>
					Choose one to continue to sign up.
				</p>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
				<button
					type='button'
					onClick={() => setSelectedRole('recruiter')}
					className={cn(
						'rounded-lg border-2 bg-[#FAFAF8] p-6 text-left shadow-sm transition-colors',
						'hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2',
						selectedRole === 'recruiter'
							? 'border-[#C2410C]'
							: 'border-[#E7E5E4]',
					)}
				>
					<h2
						className={cn(
							'text-lg font-medium tracking-tight text-[#1C1917]',
							titleClassName,
						)}
					>
						I&apos;m hiring
					</h2>
					<p className='mt-2 text-sm leading-relaxed text-[#57534E]'>
						Evaluate candidates with AI-generated challenges
					</p>
				</button>

				<button
					type='button'
					onClick={() => setSelectedRole('candidate')}
					className={cn(
						'rounded-lg border-2 bg-[#FAFAF8] p-6 text-left shadow-sm transition-colors',
						'hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2',
						selectedRole === 'candidate'
							? 'border-[#C2410C]'
							: 'border-[#E7E5E4]',
					)}
				>
					<h2
						className={cn(
							'text-lg font-medium tracking-tight text-[#1C1917]',
							titleClassName,
						)}
					>
						I&apos;m a developer
					</h2>
					<p className='mt-2 text-sm leading-relaxed text-[#57534E]'>
						Showcase your skills on real challenges
					</p>
				</button>
			</div>

			<div className='flex justify-center'>
				<button
					type='button'
					disabled={!selectedRole}
					onClick={() => selectedRole && setStep('form')}
					className={cn(
						'rounded-md px-6 py-2.5 text-sm font-medium transition-colors',
						'bg-[#C2410C] text-white hover:bg-[#9A3412]',
						'disabled:pointer-events-none disabled:opacity-40',
					)}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
