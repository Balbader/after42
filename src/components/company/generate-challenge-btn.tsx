'use client';

import { createChallenge } from '@/app/actions/challenge';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type Props = {
	jobPostId: string;
};

export function GenerateChallengeBtn({ jobPostId }: Props) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const onClick = () => {
		setError(null);
		startTransition(async () => {
			const result = await createChallenge(jobPostId);
			if ('error' in result) {
				setError(result.error);
				return;
			}
			router.push(`/company/challenges/${result.challengeId}`);
		});
	};

	return (
		<div className='mt-3 flex flex-col gap-2'>
			<button
				type='button'
				onClick={onClick}
				disabled={isPending}
				className='inline-flex w-fit items-center justify-center rounded-md bg-[#C2410C] px-4 py-2 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412] disabled:cursor-not-allowed disabled:opacity-60'
			>
				{isPending ? (
					<>
						<Loader2 className='mr-2 size-4 animate-spin' />
						Generating…
					</>
				) : (
					'Generate Challenge →'
				)}
			</button>
			{error ? (
				<p className='font-(family-name:--font-dm-sans) text-[13px] text-[#DC2626]'>
					{error}
				</p>
			) : null}
		</div>
	);
}
