'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const formSchema = z.object({
	password: z.string().min(8),
	confirmPassword: z.string().min(8),
});

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token') as string;
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		if (values.password !== values.confirmPassword) {
			toast.error('Passwords do not match');
			setIsLoading(false);
			return;
		}

		const { error } = await authClient.resetPassword({
			newPassword: values.password,
			token,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Password reset successfully');
			router.push('/');
		}

		setIsLoading(false);
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='w-full max-w-md border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-sm'>
				<CardHeader className='text-center'>
					<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
						Reset password
					</CardTitle>
					<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						Enter your new password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input {...field} type='password' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='grid gap-3'>
									<FormField
										control={form.control}
										name='confirmPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input {...field} type='password' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button
									className='w-full bg-[var(--a42-accent)] text-white hover:bg-[var(--a42-accent-hover)]'
									disabled={isLoading}
									type='submit'
								>
									{isLoading ? (
										<Loader2 className='size-4 animate-spin' />
									) : (
										'Reset Password'
									)}
								</Button>
							</div>
							<div className='text-center font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
								Don&apos;t have an account?{' '}
								<Link
									className='underline underline-offset-4 hover:text-[var(--a42-text)]'
									href='/sign-up'
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className='text-balance text-center font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-muted)] *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[var(--a42-text)]'>
				By clicking continue, you agree to our{' '}
				<Link href='/terms'>Terms of use</Link> and{' '}
				<Link href='/privacy'>Privacy policy</Link>.
			</div>
		</div>
	);
}
