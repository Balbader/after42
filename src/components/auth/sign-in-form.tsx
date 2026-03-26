'use client';

import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form-nextjs';
import { toast } from 'sonner';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignInFormProps = {
	className?: string;
};

function authClientErrorMessage(error: unknown, fallback: string): string {
	if (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	) {
		return (error as { message: string }).message || fallback;
	}
	return fallback;
}

const inputClassName =
	'w-full rounded-md border border-[var(--a42-border-strong)] bg-[var(--a42-surface)] px-3 py-2 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text)] placeholder:text-[var(--a42-text-faint)] focus-visible:border-[var(--a42-accent)] focus-visible:ring-0';

const labelClassName =
	'mb-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]';

export function SignInForm({ className }: SignInFormProps) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmitInvalid: () => {
			toast.error('Invalid data', {
				description: 'Please check your information',
			});
		},
		onSubmit: async ({ value }) => {
			const { error } = await authClient.signIn.email({
				email: value.email,
				password: value.password,
				callbackURL: '/dashboard',
			});

			if (error) {
				toast.error(authClientErrorMessage(error, 'Sign in failed'));
				return;
			}
			toast.success('Sign in successful!');
			router.push('/dashboard');
		},
	});
	return (
		<div className={cn('mx-auto w-full max-w-sm', className)}>
			<h1 className='mt-2 font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
				Sign in
			</h1>
			<p className='mb-8 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
				Enter your details to continue.
			</p>
			<form
				id='signin-form'
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.Field name='email'>
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name} className={labelClassName}>
										Email
									</FieldLabel>
									<Input
										id={field.name}
										type='email'
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										autoComplete='email'
										placeholder='you@example.com'
										className={inputClassName}
									/>
									{isInvalid && (
										<FieldError errors={field.state.meta.errors} />
									)}
								</Field>
							);
						}}
					</form.Field>
					<form.Field name='password'>
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field
									className='border-none pt-4 pb-0'
									data-invalid={isInvalid}
								>
									<FieldLabel htmlFor={field.name} className={labelClassName}>
										Password
									</FieldLabel>
									<Input
										id={field.name}
										type='password'
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										autoComplete='current-password'
										className={inputClassName}
									/>
									{isInvalid && (
										<FieldError errors={field.state.meta.errors} />
									)}
								</Field>
							);
						}}
					</form.Field>
					<button
						type='submit'
						form='signin-form'
						disabled={form.state.isSubmitting}
						className='mt-2 w-full rounded-md bg-[var(--a42-accent)] py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)] disabled:opacity-40'
					>
						{form.state.isSubmitting ? 'Signing in...' : 'Sign in'}
					</button>
				</FieldGroup>
			</form>
			<div className='mt-6 space-y-2 text-center font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-muted)]'>
				<div>
					Forgot password?{' '}
					<Link
						className='underline underline-offset-2 hover:text-[var(--a42-text)]'
						href='/forgot-password'
					>
						Reset password
					</Link>
				</div>
				<div>
					Don&apos;t have an account?{' '}
					<Link
						className='underline underline-offset-2 hover:text-[var(--a42-text)]'
						href='/sign-up'
					>
						Sign up here
					</Link>
				</div>
			</div>
		</div>
	);
}
