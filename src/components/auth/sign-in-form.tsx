'use client';

import { authClient } from '@/lib/auth-client';
import { useForm } from '@tanstack/react-form-nextjs';
import { toast } from 'sonner';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

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

export function SignInForm() {
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
		<Card className='w-full sm:max-w-md'>
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>
					Enter your email and password to sign in.
				</CardDescription>
			</CardHeader>
			<CardContent>
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
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
										className='pt-4 pb-4 border-none'
										data-invalid={isInvalid}
									>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<Input
											id={field.name}
											type='password'
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											autoComplete='current-password'
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<div className='flex justify-center mt-4'>
							<Button
								type='submit'
								form='signin-form'
								disabled={form.state.isSubmitting}
								className='w-1/3'
							>
								{form.state.isSubmitting ? 'Signing in...' : 'Sign in'}
							</Button>
						</div>
					</FieldGroup>
				</form>
				<div className='text-center text-xs text-muted-foreground mt-4 space-y-2'>
					<div>
						Forgot password?{' '}
						<Link
							className='underline underline-offset-4 hover:text-primary'
							href='/forgot-password'
						>
							Reset password
						</Link>
					</div>
					<div>
						Don&apos;t have an account?{' '}
						<Link
							className='underline underline-offset-4 hover:text-primary'
							href='/sign-up'
						>
							Sign up here
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
