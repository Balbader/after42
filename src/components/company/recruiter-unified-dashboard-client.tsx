'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

import { JobPostList } from '@/components/job-post/job-post-list';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import {
	RecruiterCard,
	SectionLabel,
	StatCard,
} from '@/components/company';
import { RecruiterCandidatesReview } from '@/components/company/recruiter-candidates-review';
import { RecruiterDashboardChallengesTab } from '@/components/company/recruiter-dashboard-challenges-tab';
import {
	RecruiterTabNav,
	RecruiterTabPanel,
	RecruiterTabProvider,
} from '@/components/company/recruiter-tabs';
import { Link } from '@/i18n/navigation';
import { StatusBadge } from '@/components/company/ui';
import { cn } from '@/lib/utils';

export type RecentChallengeItem = {
	id: string;
	title: string;
	status: string;
	createdLabel: string;
};

export type RecruiterUnifiedDashboardClientProps = {
	statJobPosts: number;
	statChallenges: number;
	statCandidates: number;
	statScored: number;
	recentChallenges: RecentChallengeItem[];
};

function CollapsibleMobileUploader() {
	const [open, setOpen] = useState(false);
	const t = useTranslations('dashboard');

	return (
		<div className='mb-6 md:mb-8'>
			<button
				type='button'
				onClick={() => setOpen((o) => !o)}
				className='mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--a42-border)] bg-[var(--a42-bg)] py-3 font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-accent)] transition-colors hover:border-[var(--a42-border-strong)] md:hidden'
			>
				{t('uploadMobileToggle')}
			</button>
			<div className={cn(!open && 'max-md:hidden', 'md:block')}>
				<RecruiterCard className='flex min-h-0 min-w-0 flex-col'>
					<SectionLabel>{t('uploadSection')}</SectionLabel>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('uploadLead')}
					</p>
					<div className='mt-5 min-h-0 flex-1'>
						<JobPostUploader embedded />
					</div>
				</RecruiterCard>
			</div>
		</div>
	);
}

function RecentChallengesSection({ items }: { items: RecentChallengeItem[] }) {
	const [open, setOpen] = useState(false);
	const t = useTranslations('dashboard');

	if (items.length === 0) return null;

	return (
		<RecruiterCard className='mt-8 bg-[var(--a42-surface-2)]'>
			<div className='flex flex-wrap items-center gap-2'>
				<SectionLabel>
					{t('recentChallengesTitle', { count: items.length })}
				</SectionLabel>
				<button
					type='button'
					onClick={() => setOpen((o) => !o)}
					className='font-(family-name:--font-dm-sans) text-[12px] font-medium text-[var(--a42-accent)] hover:underline md:hidden'
				>
					{open ? t('recentChallengesHide') : t('recentChallengesShow', { count: items.length })}
				</button>
			</div>

			<div className={cn(!open && 'max-md:hidden', 'md:block')}>
				<ul className='mt-4 divide-y divide-[var(--a42-border)] rounded-xl border border-[var(--a42-border)] bg-[var(--a42-surface)]'>
					{items.map((ch) => (
						<li key={ch.id}>
							<div className='flex min-h-12 flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between'>
								<div className='min-w-0'>
									<p className='truncate font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
										{ch.title}
									</p>
									<div className='mt-0.5 flex flex-wrap items-center gap-2'>
										<StatusBadge status={ch.status} />
										<span className='font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
											{ch.createdLabel}
										</span>
									</div>
								</div>
								<div className='flex shrink-0 gap-2'>
									<Link
										href={`/company/challenges/${ch.id}`}
										className='rounded-md border border-[var(--a42-border)] bg-[var(--a42-bg)] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-[11px] font-medium text-[var(--a42-text-muted)] transition-colors hover:border-[var(--a42-border-strong)]'
									>
										{t('pipelineOpen')}
									</Link>
									<Link
										href={`/company/challenges/${ch.id}/submissions`}
										className='rounded-md bg-[var(--a42-accent)] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-[11px] font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)]'
									>
										{t('pipelineReview')}
									</Link>
								</div>
							</div>
						</li>
					))}
				</ul>
				<div className='sticky bottom-0 mt-3 border-t border-[var(--a42-border)] bg-[var(--a42-surface-2)] pt-3 md:static md:border-0 md:bg-transparent md:pt-0'>
					<Link
						href='/dashboard?tab=challenges'
						className='inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-accent)] hover:underline'
					>
						{t('seeAllChallenges')}
						<ChevronRight className='size-3.5' />
					</Link>
				</div>
			</div>
		</RecruiterCard>
	);
}

export function RecruiterUnifiedDashboardClient({
	statJobPosts,
	statChallenges,
	statCandidates,
	statScored,
	recentChallenges,
}: RecruiterUnifiedDashboardClientProps) {
	const t = useTranslations('dashboard');
	const tJob = useTranslations('jobPost');

	const tabs = [
		{ id: 'pipeline' as const, label: t('tabPipeline') },
		{ id: 'challenges' as const, label: t('tabChallenges') },
		{ id: 'review' as const, label: t('tabReview') },
	];

	return (
		<RecruiterTabProvider>
			<div className='sticky top-0 z-20 -mx-4 border-b border-[var(--a42-border)] bg-[var(--a42-bg)]/95 px-4 pb-4 pt-2 backdrop-blur-sm md:mx-0 md:px-0'>
				<div className='flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden'>
					<div className='w-35 shrink-0 snap-start sm:w-auto'>
						<StatCard label={t('statJobPosts')} value={statJobPosts} />
					</div>
					<div className='w-35 shrink-0 snap-start sm:w-auto'>
						<StatCard label={t('statChallenges')} value={statChallenges} />
					</div>
					<div className='w-35 shrink-0 snap-start sm:w-auto'>
						<StatCard label={t('statCandidates')} value={statCandidates} />
					</div>
					<div className='w-35 shrink-0 snap-start sm:w-auto'>
						<StatCard label={t('statScored')} value={statScored} />
					</div>
				</div>
				<div className='mt-4'>
					<RecruiterTabNav tabs={tabs} />
				</div>
			</div>

			<div className='mt-8'>
				<RecruiterTabPanel id='pipeline'>
					<CollapsibleMobileUploader />

					<RecruiterCard className='flex min-h-0 min-w-0 flex-col'>
						<SectionLabel>{t('yourJobPosts')}</SectionLabel>
						<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
							{tJob('listDescription')}
						</p>
						<div className='mt-5 min-h-0 flex-1'>
							<JobPostList embedded showHeader={false} />
						</div>
					</RecruiterCard>

					<RecentChallengesSection items={recentChallenges} />
				</RecruiterTabPanel>

				<RecruiterTabPanel id='challenges'>
					<RecruiterDashboardChallengesTab />
				</RecruiterTabPanel>

				<RecruiterTabPanel id='review'>
					<RecruiterCandidatesReview embedded />
				</RecruiterTabPanel>
			</div>
		</RecruiterTabProvider>
	);
}
