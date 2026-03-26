'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
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
import { Link } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const t = useTranslations('authForgot');
	const locale = useLocale();
	const [isLoading, setIsLoading] = useState(false);

	const formSchema = useMemo(
		() =>
			z.object({
				email: z.string().email(t('zodEmail')),
				redirectTo: z.string().optional(),
			}),
		[t],
	);

	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		defaultValues: {
			email: '',
			redirectTo: `/${locale}/reset-password`,
		},
	});

	async function onSubmit(values: FormValues) {
		const parsed = formSchema.safeParse(values);
		if (!parsed.success) {
			const first = parsed.error.flatten().fieldErrors.email?.[0];
			form.setError('email', { message: first ?? t('zodEmail') });
			return;
		}

		setIsLoading(true);
		const resetPath = `/${locale}/reset-password`;
		try {
			await toast
				.promise(
					(async () => {
						const { error } = await authClient.requestPasswordReset({
							email: parsed.data.email,
							redirectTo: resetPath,
						});
						if (error) {
							throw new Error(error.message || t('toastRequestFailed'));
						}
					})(),
					{
						loading: t('toastSending'),
						success: {
							message: t('toastSent'),
							description: t('toastSentDesc'),
						},
						error: (err) => ({
							message: t('toastRequestFailed'),
							description:
								err instanceof Error ? err.message : t('toastRequestFailed'),
						}),
					},
				)
				.unwrap();
		} catch {
			// Error toast already shown by toast.promise
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='w-full max-w-md border-(--a42-border) bg-(--a42-surface) shadow-sm'>
				<CardHeader className='text-center'>
					<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-(--a42-text)'>
						{t('title')}
					</CardTitle>
					<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
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
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t('email')}</FormLabel>
												<FormControl>
													<Input
														placeholder={t('emailPlaceholder')}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button
									className='w-full bg-(--a42-accent) text-white hover:bg-(--a42-accent-hover)'
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
							<div className='text-center font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
								{t('footerNoAccount')}{' '}
								<Link
									className='underline underline-offset-4 hover:text-(--a42-text)'
									href='/sign-up'
								>
									{t('signUp')}
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className='text-balance text-center font-(family-name:--font-dm-sans) text-xs text-(--a42-text-muted) *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-(--a42-text)'>
				{t('legal')}{' '}
				<Link href='/terms'>{t('terms')}</Link> {t('and')}{' '}
				<Link href='/privacy'>{t('privacy')}</Link>.
			</div>
		</div>
	);
}
