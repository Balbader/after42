'use client';

import { Suspense, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
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
import { Link, useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<Suspense
			fallback={
				<div className={cn('flex flex-col items-center gap-6', className)}>
					<Loader2 className='size-6 animate-spin text-[var(--a42-text-muted)]' />
				</div>
			}
		>
			<ResetPasswordFormInner className={className} {...props} />
		</Suspense>
	);
}

function ResetPasswordFormInner({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const t = useTranslations('authReset');
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get('token') as string;
	const [isLoading, setIsLoading] = useState(false);

	const formSchema = useMemo(
		() =>
			z.object({
				password: z.string().min(8, t('zodPasswordMin')),
				confirmPassword: z.string().min(8, t('zodPasswordMin')),
			}),
		[t],
	);

	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: FormValues) {
		const parsed = formSchema.safeParse(values);
		if (!parsed.success) {
			const fe = parsed.error.flatten().fieldErrors;
			if (fe.password?.[0])
				form.setError('password', { message: fe.password[0] });
			if (fe.confirmPassword?.[0])
				form.setError('confirmPassword', { message: fe.confirmPassword[0] });
			return;
		}

		if (!token?.trim()) {
			toast.error(t('toastInvalidLink'));
			return;
		}

		if (parsed.data.password !== parsed.data.confirmPassword) {
			toast.error(t('toastMismatch'));
			return;
		}

		setIsLoading(true);
		try {
			await toast
				.promise(
					(async () => {
						const { error } = await authClient.resetPassword({
							newPassword: parsed.data.password,
							token,
						});
						if (error) {
							throw new Error(error.message || t('toastResetFailed'));
						}
					})(),
					{
						loading: t('toastResetting'),
						success: {
							message: t('toastSuccess'),
							description: t('toastSuccessDesc'),
						},
						error: (err) => ({
							message: t('toastResetFailed'),
							description:
								err instanceof Error ? err.message : t('toastResetFailed'),
						}),
					},
				)
				.unwrap();
			router.push('/');
		} catch {
			// Error toast already shown by toast.promise
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='w-full max-w-md border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-sm'>
				<CardHeader className='text-center'>
					<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
						{t('title')}
					</CardTitle>
					<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('description')}
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
												<FormLabel>{t('password')}</FormLabel>
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
												<FormLabel>{t('confirmPassword')}</FormLabel>
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
										t('submit')
									)}
								</Button>
							</div>
							<div className='text-center font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
								{t('footerNoAccount')}{' '}
								<Link
									className='underline underline-offset-4 hover:text-[var(--a42-text)]'
									href='/sign-up'
								>
									{t('signUp')}
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className='text-balance text-center font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-muted)] *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[var(--a42-text)]'>
				{t('legal')}{' '}
				<Link href='/terms'>{t('terms')}</Link> {t('and')}{' '}
				<Link href='/privacy'>{t('privacy')}</Link>.
			</div>
		</div>
	);
}
