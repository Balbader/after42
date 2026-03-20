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
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

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
				toast.error(error.message ?? 'Sign in failed');
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
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name='email'>
							{(field) => (
								<FieldGroup>
									<FieldLabel>Email</FieldLabel>
									<Input
										type='email'
										name='email'
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</FieldGroup>
							)}
						</form.Field>
					</FieldGroup>
					<FieldGroup>
						<form.Field name='password'>
							{(field) => (
								<FieldGroup className='pt-4 pb-4 border-none'>
									<FieldLabel>Password</FieldLabel>
									<Input
										type='password'
										name='password'
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</FieldGroup>
							)}
						</form.Field>
					</FieldGroup>
					<FieldGroup>
						<Button type='submit' form='signin-form' className='w-1/3 mx-auto mt-4'>
							Sign in
						</Button>
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
