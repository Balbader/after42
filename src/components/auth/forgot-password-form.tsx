'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
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
	email: z.string().email(),
	redirectTo: z.string().optional(),
});

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			email: '',
			redirectTo: '/reset-password',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		const { error } = await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: '/reset-password',
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success('Password reset email sent');
		}

		setIsLoading(false);
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='w-full max-w-md border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-sm'>
				<CardHeader className='text-center'>
					<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
						Forgot password
					</CardTitle>
					<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						Enter your email to reset your password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder='m@example.com' {...field} />
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
