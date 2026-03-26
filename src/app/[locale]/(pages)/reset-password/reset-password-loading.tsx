'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export function ResetPasswordLoading() {
	const t = useTranslations('authReset');
	return (
		<Card className='w-full border-[var(--a42-border)] bg-[var(--a42-surface)] shadow-sm sm:max-w-md'>
			<CardHeader className='text-center'>
				<CardTitle className='font-(family-name:--font-fraunces) text-[28px] font-normal tracking-[-0.02em] text-[var(--a42-text)]'>
					{t('title')}
				</CardTitle>
				<CardDescription className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
					{t('loading')}
				</CardDescription>
			</CardHeader>
			<CardContent className='flex items-center justify-center py-8'>
				<Loader2 className='size-8 animate-spin text-[var(--a42-text-muted)]' />
			</CardContent>
		</Card>
	);
}
