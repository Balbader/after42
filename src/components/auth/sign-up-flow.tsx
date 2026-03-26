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
						'font-(family-name:--font-fraunces) text-2xl font-normal tracking-[-0.02em] text-[var(--a42-text)] sm:text-[28px]',
						titleClassName,
					)}
				>
					How will you use after
					<span className='text-[var(--a42-accent)]'>42</span>?
				</h1>
				<p className='mt-2 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
					Choose one to continue to sign up.
				</p>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
				<button
					type='button'
					onClick={() => setSelectedRole('recruiter')}
					className={cn(
						'rounded-lg border-2 bg-[var(--a42-bg)] p-6 text-left shadow-sm transition-colors',
						'hover:border-[var(--a42-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a42-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--a42-bg)]',
						selectedRole === 'recruiter'
							? 'border-[var(--a42-accent)]'
							: 'border-[var(--a42-border)]',
					)}
				>
					<h2
						className={cn(
							'font-(family-name:--font-dm-sans) text-lg font-medium tracking-tight text-[var(--a42-text)]',
							titleClassName,
						)}
					>
						I&apos;m hiring
					</h2>
					<p className='mt-2 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)]'>
						Evaluate candidates with AI-generated challenges
					</p>
				</button>

				<button
					type='button'
					onClick={() => setSelectedRole('candidate')}
					className={cn(
						'rounded-lg border-2 bg-[var(--a42-bg)] p-6 text-left shadow-sm transition-colors',
						'hover:border-[var(--a42-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--a42-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--a42-bg)]',
						selectedRole === 'candidate'
							? 'border-[var(--a42-accent)]'
							: 'border-[var(--a42-border)]',
					)}
				>
					<h2
						className={cn(
							'font-(family-name:--font-dm-sans) text-lg font-medium tracking-tight text-[var(--a42-text)]',
							titleClassName,
						)}
					>
						I&apos;m a developer
					</h2>
					<p className='mt-2 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)]'>
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
						'rounded-md px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium transition-colors',
						'bg-[var(--a42-accent)] text-white hover:bg-[var(--a42-accent-hover)]',
						'disabled:pointer-events-none disabled:opacity-40',
					)}
				>
					Continue
				</button>
			</div>
		</div>
	);
}

