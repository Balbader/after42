'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { forkChallenge } from '@/app/actions/fork-challenge';
import { Loader2 } from 'lucide-react';

type Props = {
	challengeId: string;
};

export function ForkChallengeBtn({ challengeId }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const handleClick = () => {
		setError(null);
		startTransition(async () => {
			const result = await forkChallenge(challengeId);
			if ('error' in result) {
				setError(result.error);
				return;
			}
			router.push(`/candidate/challenges/${challengeId}/submit`);
		});
	};

	return (
		<div className='flex flex-col gap-2'>
			<button
				type='button'
				onClick={handleClick}
				disabled={isPending}
				className='inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-white transition-colors hover:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-60'
			>
				{isPending ? (
					<>
						<Loader2 className='mr-2 size-4 animate-spin' />
						Setting up repository…
					</>
				) : error ? (
					'Retry'
				) : (
					'Complete Challenge'
				)}
			</button>
			{error && (
				<p className='font-[family-name:var(--font-dm-sans)] text-[13px] text-[#DC2626]'>
					We couldn&apos;t set up your repository. Please try again or contact support.
				</p>
			)}
		</div>
	);
}
