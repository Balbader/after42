'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import {
	closeChallenge,
	listRecruiterChallengesDashboard,
	type ChallengeSubmissionStats,
	type RecruiterChallengeDashboardRow,
} from '@/app/actions/challenge';
import {
	EmptyState,
	RecruiterCard,
	ScoreBadge,
	StatusBadge,
} from '@/components/company';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'active' | 'draft' | 'scored';
type Sort = 'recent' | 'submissions' | 'score';

const EMPTY_CHALLENGES: RecruiterChallengeDashboardRow[] = [];
const EMPTY_STATS: Record<string, ChallengeSubmissionStats> = {};

export function RecruiterDashboardChallengesTab() {
	const t = useTranslations('company');
	const tDash = useTranslations('dashboard.challengesTab');
	const router = useRouter();
	const [raw, setRaw] = useState<{
		challenges: RecruiterChallengeDashboardRow[];
		statsById: Record<string, ChallengeSubmissionStats>;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<Filter>('all');
	const [sort, setSort] = useState<Sort>('recent');
	const [, startTransition] = useTransition();

	const load = useCallback(() => {
		listRecruiterChallengesDashboard().then((res) => {
			if ('error' in res) {
				setError(res.error);
				setRaw({ challenges: [], statsById: {} });
				return;
			}
			setError(null);
			setRaw(res);
		});
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const challenges = raw?.challenges ?? EMPTY_CHALLENGES;
	const statsById = raw?.statsById ?? EMPTY_STATS;

	const filtered = useMemo(() => {
		let list = [...challenges];
		if (filter === 'active') list = list.filter((c) => c.status === 'active');
		if (filter === 'draft') list = list.filter((c) => c.status === 'draft');
		if (filter === 'scored') {
			list = list.filter((c) => {
				const top = statsById[c.id]?.topScore;
				return top != null;
			});
		}

		if (sort === 'recent') {
			list.sort(
				(a, b) =>
					new Date(b.createdAt ?? 0).getTime() -
					new Date(a.createdAt ?? 0).getTime(),
			);
		} else if (sort === 'submissions') {
			list.sort(
				(a, b) =>
					(statsById[b.id]?.n ?? 0) - (statsById[a.id]?.n ?? 0),
			);
		} else {
			list.sort(
				(a, b) =>
					(statsById[b.id]?.topScore ?? -1) - (statsById[a.id]?.topScore ?? -1),
			);
		}
		return list;
	}, [challenges, filter, sort, statsById]);

	const onArchive = (id: string) => {
		startTransition(async () => {
			const res = await closeChallenge(id);
			if ('error' in res) {
				setError(res.error);
				return;
			}
			load();
			router.refresh();
		});
	};

	if (error && challenges.length === 0 && raw !== null) {
		return (
			<div className='mt-6 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 font-(family-name:--font-dm-sans) text-sm text-[#B91C1C]'>
				{error}
			</div>
		);
	}

	if (raw && challenges.length === 0) {
		return (
			<div className='mt-6'>
				<EmptyState
					title={t('challengesEmptyTitle')}
					description={t('challengesEmptyDesc')}
					href='/dashboard?tab=pipeline'
					cta={tDash('emptyPipelineCta')}
				/>
			</div>
		);
	}

	if (!raw) {
		return (
			<div className='mt-8 space-y-4'>
				<div className='h-40 animate-pulse rounded-2xl bg-[#F5F4F1]' />
				<div className='h-40 animate-pulse rounded-2xl bg-[#F5F4F1]' />
			</div>
		);
	}

	return (
		<div className='mt-6'>
			<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
				<div
					className='flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
					role='group'
					aria-label={tDash('filterAria')}
				>
					{(['all', 'active', 'draft', 'scored'] as const).map((f) => (
						<button
							key={f}
							type='button'
							onClick={() => setFilter(f)}
							className={cn(
								'snap-start rounded-full border px-3 py-1.5 font-(family-name:--font-dm-sans) text-xs font-medium whitespace-nowrap transition-colors',
								filter === f
									? 'border-[#C2410C] bg-[#FFF7ED] text-[#C2410C]'
									: 'border-[#E7E5E4] bg-[#FFFFFF] text-[#78716C] hover:border-[#D6D3D1]',
							)}
						>
							{tDash(`filter_${f}`)}
						</button>
					))}
				</div>
				<div className='flex items-center gap-2'>
					<label htmlFor='challenge-sort' className='sr-only'>
						{tDash('sortLabel')}
					</label>
					<select
						id='challenge-sort'
						value={sort}
						onChange={(e) => setSort(e.target.value as Sort)}
						className='rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] px-3 py-2 font-(family-name:--font-dm-sans) text-[13px] text-[#1C1917] shadow-sm'
					>
						<option value='recent'>{tDash('sortRecent')}</option>
						<option value='submissions'>{tDash('sortSubmissions')}</option>
						<option value='score'>{tDash('sortScore')}</option>
					</select>
				</div>
			</div>

			{error ? (
				<p className='mt-3 font-(family-name:--font-dm-sans) text-[13px] text-[#DC2626]' role='alert'>
					{error}
				</p>
			) : null}

			{filtered.length === 0 ? (
				<div className='mt-10 rounded-2xl border border-dashed border-[#E7E5E4] bg-[#FAFAF8] px-6 py-12 text-center'>
					<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
						{tDash('filterEmpty')}
					</p>
				</div>
			) : (
				<div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
					{filtered.map((ch) => {
						const stats = statsById[ch.id];
						const n = stats?.n ?? 0;
						const topScore = stats?.topScore ?? null;
						const created = ch.createdAt
							? formatDistanceToNow(new Date(ch.createdAt), { addSuffix: true })
							: '';

						return (
							<RecruiterCard
								key={ch.id}
								className='group flex flex-col p-0'
								padding='none'
							>
								<div className='flex flex-1 flex-col p-4 sm:p-5 md:p-6'>
									<div className='flex items-start justify-between gap-2'>
										<div className='min-w-0 flex-1'>
											<Link
												href={`/company/challenges/${ch.id}/submissions`}
												className='block rounded-md outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#C2410C]'
											>
												<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917] transition-colors group-hover:text-[#C2410C]'>
													{ch.title}
												</h2>
											</Link>
											<p className='mt-1.5 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
												{ch.seniority_level} · {parseTechStack(ch.tech_stack)}
											</p>
										</div>
										<div className='flex shrink-0 items-start gap-1'>
											<StatusBadge status={ch.status} />
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button
														type='button'
														className='rounded-md p-1.5 text-[#78716C] transition-colors hover:bg-[#F5F4F1] hover:text-[#1C1917] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]'
														aria-label={tDash('actionsAria')}
													>
														<MoreHorizontal className='size-4' />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='min-w-44'>
													<DropdownMenuItem asChild>
														<Link href={`/company/challenges/${ch.id}`}>
															{tDash('actionDetail')}
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link href={`/company/challenges/${ch.id}/submissions`}>
															{tDash('actionSubmissions')}
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link href={`/company/challenges/${ch.id}`}>
															{tDash('actionEdit')}
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														variant='destructive'
														disabled={ch.status === 'closed'}
														onClick={() => onArchive(ch.id)}
													>
														{tDash('actionArchive')}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>

									<div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#F5F4F1] pt-4 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
										<span className='tabular-nums'>
											{t('challengeCardSubmissions', { count: n })}
										</span>
										{topScore !== null ? (
											<span className='flex items-center gap-1.5'>
												{t('challengeCardTopScore')}:{' '}
												<ScoreBadge score={topScore} size='sm' />
											</span>
										) : null}
										<span className='text-[#A8A29E]'>{created}</span>
									</div>

									<div className='mt-5 flex flex-wrap gap-2'>
										<Link
											href={`/company/challenges/${ch.id}`}
											className='inline-flex items-center rounded-lg border border-[#E7E5E4] bg-[#FAFAF8] px-3 py-2 font-(family-name:--font-dm-sans) text-[12px] font-medium text-[#57534E] transition-colors hover:border-[#D6D3D1]'
										>
											{t('challengeOpenDetail')}
										</Link>
										<Link
											href={`/company/challenges/${ch.id}/submissions`}
											className='inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#C2410C] px-3 py-2 font-(family-name:--font-dm-sans) text-[12px] font-medium text-white transition-colors hover:bg-[#9A3412] sm:flex-none'
										>
											{t('challengeCardCta')}
											<ChevronRight className='size-3.5 opacity-90' />
										</Link>
									</div>
								</div>
							</RecruiterCard>
						);
					})}
				</div>
			)}
		</div>
	);
}
