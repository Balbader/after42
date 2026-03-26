'use client';

import { createChallenge, type CreateChallengePreview } from '@/app/actions/challenge';
import { Link, useRouter } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { StatusBadge } from '@/components/company/ui';

type Props = {
	jobPostId: string;
	/** `inline` keeps the user on the dashboard with an expandable result panel. */
	variant?: 'redirect' | 'inline';
};

type PanelState =
	| { phase: 'idle' }
	| { phase: 'loading' }
	| { phase: 'success'; data: CreateChallengePreview }
	| { phase: 'error'; message: string };

export function GenerateChallengeBtn({ jobPostId, variant = 'redirect' }: Props) {
	const router = useRouter();
	const t = useTranslations('dashboard.generate');
	const [error, setError] = useState<string | null>(null);
	const [panel, setPanel] = useState<PanelState>({ phase: 'idle' });
	const [isPending, startTransition] = useTransition();

	const runCreate = () => {
		setError(null);
		if (variant === 'inline') {
			setPanel({ phase: 'loading' });
		}
		startTransition(async () => {
			const result = await createChallenge(jobPostId);
			if ('error' in result) {
				if (variant === 'inline') {
					setPanel({ phase: 'error', message: result.error });
				} else {
					setError(result.error);
				}
				return;
			}
			if (variant === 'redirect') {
				router.push(`/company/challenges/${result.challengeId}`);
				return;
			}
			setPanel({ phase: 'success', data: result });
			router.refresh();
		});
	};

	const stackLabel =
		panel.phase === 'success'
			? panel.data.techStack.slice(0, 4).join(', ') +
				(panel.data.techStack.length > 4 ? '…' : '')
			: '';

	return (
		<div className='mt-3 flex flex-col gap-2'>
			<button
				type='button'
				onClick={runCreate}
				disabled={isPending || panel.phase === 'loading'}
				className='inline-flex w-fit items-center justify-center rounded-md bg-[#C2410C] px-4 py-2 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF8] disabled:cursor-not-allowed disabled:opacity-60'
			>
				{isPending || panel.phase === 'loading' ? (
					<>
						<Loader2 className='mr-2 size-4 animate-spin' aria-hidden />
						{variant === 'inline' ? t('analyzing') : t('generatingShort')}
					</>
				) : (
					t('cta')
				)}
			</button>

			{variant === 'inline' && panel.phase === 'loading' ? (
				<p
					className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'
					role='status'
					aria-live='polite'
				>
					{t('analyzing')}
				</p>
			) : null}

			{variant === 'redirect' && error ? (
				<p className='font-(family-name:--font-dm-sans) text-[13px] text-[#DC2626]' role='alert'>
					{error}
				</p>
			) : null}

			{variant === 'inline' && panel.phase === 'error' ? (
				<div
					className='rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4'
					role='alert'
				>
					<p className='font-(family-name:--font-dm-sans) text-sm text-[#B91C1C]'>{panel.message}</p>
					<button
						type='button'
						onClick={runCreate}
						className='mt-3 inline-flex items-center rounded-md border border-[#FECACA] bg-[#FFFFFF] px-3 py-1.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#991B1B] hover:bg-[#FEF2F2]'
					>
						{t('retry')}
					</button>
				</div>
			) : null}

			{variant === 'inline' && panel.phase === 'success' ? (
				<div className='rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4'>
					<div className='flex items-center gap-2'>
						<svg
							className='size-5 shrink-0 text-[#16A34A]'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							aria-hidden
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
						<p className='font-(family-name:--font-dm-sans) text-sm font-semibold text-[#166534]'>
							{t('generatedTitle')}
						</p>
					</div>
					<p className='mt-2 font-(family-name:--font-fraunces) text-base font-medium text-[#1C1917]'>
						{panel.data.title}
					</p>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#57534E]'>
						{t('seniorityStack', {
							seniority: panel.data.seniority_level,
							stack: stackLabel || '—',
						})}
					</p>
					<div className='mt-2 flex flex-wrap items-center gap-2'>
						<span className='font-(family-name:--font-dm-sans) text-[12px] text-[#78716C]'>
							{t('statusLabel')}
						</span>
						<StatusBadge status={panel.data.status} />
					</div>
					<div className='mt-4 flex flex-wrap gap-2'>
						<Link
							href={`/company/challenges/${panel.data.challengeId}`}
							className='inline-flex items-center justify-center rounded-lg bg-[#C2410C] px-3 py-2 font-(family-name:--font-dm-sans) text-[12px] font-medium text-white hover:bg-[#9A3412]'
						>
							{t('viewFull')}
						</Link>
						<button
							type='button'
							onClick={() => setPanel({ phase: 'idle' })}
							className='inline-flex items-center justify-center rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] px-3 py-2 font-(family-name:--font-dm-sans) text-[12px] font-medium text-[#57534E] hover:border-[#D6D3D1]'
						>
							{t('generateAnother')}
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
