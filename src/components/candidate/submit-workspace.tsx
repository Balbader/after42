'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { useCallback, useEffect, useId, useState, useTransition } from 'react';

import { submitChallenge } from '@/app/actions/submit-challenge';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

function stripMarkdownLite(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\n+/g, ' ')
		.trim()
		.slice(0, 400);
}

type Props = {
	challengeId: string;
	cloneUrl: string;
	submission: { id: string; githubForkName: string; sequenceNum: number };
	challenge: {
		title: string;
		challengeContent: { readme: string } | null;
	};
};

export function SubmitWorkspace({
	challengeId,
	cloneUrl,
	submission,
	challenge,
}: Props) {
	const router = useRouter();
	const statusId = useId();
	const [commitCount, setCommitCount] = useState<number | null>(null);
	const [openSetup, setOpenSetup] = useState(true);
	const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
	const [copyPush, setCopyPush] = useState<'idle' | 'copied'>('idle');
	const [isPending, startTransition] = useTransition();

	const poll = useCallback(async () => {
		try {
			const res = await fetch(
				`/api/commits/${encodeURIComponent(submission.githubForkName)}`,
				{ credentials: 'same-origin' },
			);
			if (!res.ok) return;
			const data = (await res.json()) as { commits?: number };
			if (typeof data.commits === 'number') {
				setCommitCount(data.commits);
			}
		} catch {
			/* ignore */
		}
	}, [submission.githubForkName]);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			void poll();
		}, 0);
		const intervalId = window.setInterval(() => {
			void poll();
		}, 10_000);
		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	}, [poll]);

	const readme = challenge.challengeContent?.readme ?? '';
	const preview = readme ? stripMarkdownLite(readme) : '';

	const cloneCmd = `git clone ${cloneUrl}`;
	const pushCmd = `git add .
git commit -m "my changes"
git push origin main`;

	const copyToClipboard = async (
		text: string,
		setter: (s: 'idle' | 'copied') => void,
	) => {
		try {
			await navigator.clipboard.writeText(text);
			setter('copied');
			setTimeout(() => setter('idle'), 2000);
		} catch {
			/* ignore */
		}
	};

	const banner =
		commitCount === null ? (
			<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				Checking repository…
			</p>
		) : commitCount === 0 ? (
			<p className='font-(family-name:--font-dm-sans) text-sm text-[#C2410C]'>
				● Waiting for your first push…
			</p>
		) : commitCount === 1 ? (
			<p className='font-(family-name:--font-dm-sans) text-sm text-[#D97706]'>
				● First commit received! Keep going.
			</p>
		) : (
			<p className='font-(family-name:--font-dm-sans) text-sm text-[#16A34A]'>
				● {commitCount} commits pushed. Ready to submit.
			</p>
		);

	const checklist = (
		<div className='rounded-lg border border-[#E7E5E4] bg-white p-4 md:border-0 md:bg-transparent md:p-0'>
			<h3 className='mb-3 font-(family-name:--font-dm-sans) text-[13px] font-semibold uppercase tracking-[0.04em] text-[#78716C]'>
				Checklist
			</h3>
			<ul className='space-y-3 font-(family-name:--font-dm-sans) text-sm'>
				<li className='flex items-start gap-2 text-[#1C1917]'>
					<span className='text-[#16A34A]' aria-hidden>
						✔
					</span>
					Repository created
				</li>
				<li
					className={`flex items-start gap-2 ${commitCount != null && commitCount >= 1 ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}
				>
					<span aria-hidden>
						{commitCount != null && commitCount >= 1 ? '✔' : '□'}
					</span>
					Code pushed
				</li>
				<li
					className={`flex items-start gap-2 ${commitCount != null && commitCount >= 1 ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}
				>
					<span aria-hidden>
						{commitCount != null && commitCount >= 1 ? '✔' : '□'}
					</span>
					Ready to submit
				</li>
			</ul>
		</div>
	);

	return (
		<div className='pb-28'>
			<div className='flex flex-col gap-6 md:flex-row md:items-start'>
				<div className='flex min-w-0 flex-1 flex-col gap-6'>
					<div
						id={statusId}
						aria-live='polite'
						aria-atomic='true'
						className='bg-[#FFF7ED] p-4'
						style={{
							borderLeftWidth: 3,
							borderLeftStyle: 'solid',
							borderLeftColor:
								commitCount === null || commitCount === 0
									? '#C2410C'
									: commitCount === 1
										? '#D97706'
										: '#16A34A',
						}}
					>
						{banner}
					</div>

					<div className='md:hidden'>{checklist}</div>

					<section>
						<h2 className='mb-4 font-(family-name:--font-fraunces) text-[22px] font-medium text-[#1C1917]'>
							{challenge.title}
						</h2>
						{preview && (
							<p className='font-(family-name:--font-dm-sans) text-sm italic leading-relaxed text-[#78716C]'>
								{preview}
								…{' '}
								<Link
									href={`/candidate/challenges/${challengeId}`}
									className='font-medium not-italic text-[#C2410C] underline hover:text-[#9A3412]'
								>
									Read the full brief
								</Link>{' '}
								above.
							</p>
						)}
					</section>

					<section>
						<button
							type='button'
							onClick={() => setOpenSetup((o) => !o)}
							className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#78716C]'
						>
							{openSetup ? <ChevronDown className='mr-1 inline size-3' /> : <ChevronRight className='mr-1 inline size-3' />}Setup Instructions
						</button>
						{openSetup && (
							<div className='mt-4 space-y-6'>
								<div>
									<p className='mb-2 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
										1. Clone your fork:
									</p>
									<div className='relative rounded-md bg-[#F5F4F1] p-3 pr-16'>
										<pre className='font-mono overflow-x-auto text-xs text-[#1C1917]'>
											{cloneCmd}
										</pre>
										<button
											type='button'
											onClick={() =>
												void copyToClipboard(cloneCmd, setCopyState)
											}
											className='absolute top-2 right-2 font-(family-name:--font-dm-sans) text-[11px] text-[#78716C] hover:text-[#1C1917]'
										>
											{copyState === 'copied' ? '✓ Copied' : '⎘ Copy'}
										</button>
									</div>
								</div>
								<div>
									<p className='mb-2 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
										2. Make your changes, then push:
									</p>
									<div className='relative rounded-md bg-[#F5F4F1] p-3 pr-16'>
										<pre className='font-mono overflow-x-auto whitespace-pre text-xs text-[#1C1917]'>
											{pushCmd}
										</pre>
										<button
											type='button'
											onClick={() =>
												void copyToClipboard(pushCmd, setCopyPush)
											}
											className='absolute top-2 right-2 font-(family-name:--font-dm-sans) text-[11px] text-[#78716C] hover:text-[#1C1917]'
										>
											{copyPush === 'copied' ? '✓ Copied' : '⎘ Copy'}
										</button>
									</div>
								</div>
							</div>
						)}
					</section>
				</div>

				<div className='hidden w-80 shrink-0 md:block'>{checklist}</div>
			</div>

			<div className='sticky bottom-0 z-10 mt-8 border-t border-[#E7E5E4] bg-white px-6 py-4 md:px-8'>
				<div className='mx-auto flex max-w-4xl items-center justify-between gap-4'>
					<p className='truncate font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
						{challenge.title}
					</p>
					<button
						type='button'
						title={
							commitCount === 0 || commitCount === null
								? 'Push your code first'
								: undefined
						}
						aria-describedby={statusId}
						disabled={
							isPending ||
							commitCount === null ||
							commitCount === 0
						}
						onClick={() => {
							startTransition(async () => {
								const res = await submitChallenge(submission.id);
								if ('ok' in res && res.ok) {
									router.refresh();
								}
							});
						}}
						className={`inline-flex shrink-0 items-center justify-center rounded-md px-5 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium ${
							commitCount === null || commitCount === 0
								? 'cursor-not-allowed bg-[#E7E5E4] text-[#A8A29E]'
								: 'bg-[#C2410C] text-white hover:bg-[#9A3412]'
						}`}
					>
						{isPending ? (
							<>
								<Loader2 className='mr-2 size-4 animate-spin' />
								Submitting…
							</>
						) : (
							'Archive Repo & Submit'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
