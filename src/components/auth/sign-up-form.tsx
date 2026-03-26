'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from '@tanstack/react-form-nextjs';
import { toast } from 'sonner';
import * as z from 'zod';

import { signUpAction } from '@/app/actions/auth';
import { SignUpDateField } from '@/components/auth/sign-up-date-field';
import { SignUpTermsField } from '@/components/auth/sign-up-terms-field';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/navigation';
import { log } from '@/lib/log-helpers';

type SignUpFormProps = {
	/** When set from the role picker step, the role field can be hidden. */
	initialRole?: 'candidate' | 'recruiter';
	hideRoleSelect?: boolean;
};

export function SignUpForm({
	initialRole = 'candidate',
	hideRoleSelect = false,
}: SignUpFormProps) {
	const t = useTranslations('authSignUp');

	const formSchema = useMemo(
		() =>
			z
				.object({
					role: z.enum(['candidate', 'recruiter']),
					first_name: z.string().min(1, t('zodFirstName')),
					last_name: z.string().min(1, t('zodLastName')),
					email: z.string().email(t('zodEmail')),
					password: z.string().min(8, t('zodPassword')),
					dateOfBirth: z.number().min(1, t('zodDob')),
					termsAccepted: z.boolean().refine((val) => val === true, {
						message: t('zodTerms'),
					}),
				})
				.required(),
		[t],
	);

	const form = useForm({
		defaultValues: {
			role: initialRole,
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			dateOfBirth: 0,
			termsAccepted: false,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmitInvalid: () => {
			toast.error(t('toastInvalid'), {
				description: t('toastInvalidDesc'),
			});
		},
		onSubmit: async ({ value }) => {
			const timestamp = Date.now();
			const formData = new FormData();
			formData.append('role', value.role);
			formData.append('first_name', value.first_name);
			formData.append('last_name', value.last_name);
			formData.append('email', value.email);
			formData.append('password', value.password);
			formData.append('dateOfBirth', value.dateOfBirth.toString());
			formData.append('termsAcceptedAt', timestamp.toString());
			formData.append('privacyPolicyAcceptedAt', timestamp.toString());
			log('Submitting form with values:', value);

			try {
				await toast
					.promise(
						(async () => {
							const result = await signUpAction(formData);
							if (!result.success) {
								throw new Error(result.error || t('toastTryAgain'));
							}
						})(),
						{
							loading: t('toastSigningUp'),
							success: {
								message: t('toastSuccess'),
								description: t('toastSuccessDesc'),
							},
							error: (err) => ({
								message: t('toastFailed'),
								description:
									err instanceof Error ? err.message : t('toastTryAgain'),
							}),
						},
					)
					.unwrap();
			} catch (error) {
				log('Sign up error:', error);
			}
		},
	});

	return (
		<Card className='w-full border-(--a42-border) bg-(--a42-surface) shadow-sm sm:max-w-md'>
			<CardHeader>
				<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-(--a42-text)'>
					{t('cardTitle')}
				</CardTitle>
				<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
					{t('cardDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					id='signup-form'
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<FieldGroup>
						{!hideRoleSelect && (
							<form.Field name='role'>
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>{t('role')}</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(v) =>
													field.handleChange(v as 'candidate' | 'recruiter')
												}
											>
												<SelectTrigger>
													<SelectValue placeholder={t('selectRole')} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='candidate'>
														{t('candidate')}
													</SelectItem>
													<SelectItem value='recruiter'>
														{t('recruiter')}
													</SelectItem>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						)}
						<form.Field name='first_name'>
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{t('firstName')}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder={t('firstNamePlaceholder')}
											autoComplete='given-name'
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name='last_name'>
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{t('lastName')}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder={t('lastNamePlaceholder')}
											autoComplete='family-name'
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name='email'>
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{t('email')}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder={t('emailPlaceholder')}
											autoComplete='email'
											type='email'
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
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>{t('password')}</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											type='password'
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder={t('passwordPlaceholder')}
											autoComplete='new-password'
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name='dateOfBirth'>
							{(field) => (
								<SignUpDateField
									value={field.state.value}
									isTouched={field.state.meta.isTouched}
									isValid={field.state.meta.isValid}
									errors={field.state.meta.errors}
									onChange={field.handleChange}
								/>
							)}
						</form.Field>
						<form.Field name='termsAccepted'>
							{(field) => (
								<SignUpTermsField
									name={field.name}
									value={field.state.value}
									isTouched={field.state.meta.isTouched}
									isValid={field.state.meta.isValid}
									errors={field.state.meta.errors}
									onChange={field.handleChange}
									onBlur={field.handleBlur}
								/>
							)}
						</form.Field>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className='flex flex-col gap-4'>
				<Field
					orientation='horizontal'
					className='mx-auto mt-4 flex flex-row justify-center gap-4'
				>
					<Button type='button' variant='outline' onClick={() => form.reset()}>
						{t('clear')}
					</Button>
					<Button
						type='submit'
						form='signup-form'
						disabled={form.state.isSubmitting}
						className='w-1/3 bg-(--a42-accent) text-white hover:bg-(--a42-accent-hover)'
					>
						{form.state.isSubmitting ? t('submitting') : t('submit')}
					</Button>
				</Field>
				<p className='mt-4 text-center font-(family-name:--font-dm-sans) text-xs text-(--a42-text-muted)'>
					{t('footerPrompt')}{' '}
					<Link
						href='/sign-in'
						className='underline underline-offset-4 hover:text-(--a42-text)'
					>
						{t('footerLink')}
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
