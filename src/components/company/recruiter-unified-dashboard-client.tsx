'use client';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslations } from 'next-intl';

import { JobPostList } from '@/components/job-post/job-post-list';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import {
    EmptyState,
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
    useRecruiterTab,
} from '@/components/company/recruiter-tabs';
import { cn } from '@/lib/utils';

const FOCUS_RING =
	'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]';
export type RecruiterUnifiedDashboardClientProps = {
    statJobPosts: number;
    statChallenges: number;
    statCandidates: number;
    statScored: number;
};

function CollapsibleMobileUploader({
	mobileOpen,
	setMobileOpen,
}: {
	mobileOpen: boolean;
	setMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
	const t = useTranslations('dashboard');

	return (
		<div
			id='dashboard-job-post-uploader'
			className='mb-6 scroll-mt-24 md:mb-8'
		>
			<button
				type='button'
				onClick={() => setMobileOpen((o) => !o)}
				className={cn(
					'mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-(--a42-border) bg-(--a42-bg) py-3 font-(family-name:--font-dm-sans) text-sm font-medium text-(--a42-accent) transition-colors hover:border-(--a42-border-strong) md:hidden',
					FOCUS_RING,
				)}
			>
				{t('uploadMobileToggle')}
			</button>
			<div className={cn(!mobileOpen && 'max-md:hidden', 'md:block')}>
				<RecruiterCard className='flex min-h-0 min-w-0 flex-col'>
					<SectionLabel>{t('uploadSection')}</SectionLabel>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
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
function RecruiterUnifiedDashboardInner({
    statJobPosts,
    statChallenges,
    statCandidates,
    statScored,
}: RecruiterUnifiedDashboardClientProps) {
	const t = useTranslations('dashboard');
	const tJob = useTranslations('jobPost');
	const [mobileUploaderOpen, setMobileUploaderOpen] = useState(false);
	const { setTab } = useRecruiterTab();

	const scrollToUploader = () => {
		setMobileUploaderOpen(true);
		requestAnimationFrame(() => {
			document
				.getElementById('dashboard-job-post-uploader')
				?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	};

	const tabs = [
		{ id: 'pipeline' as const, label: t('tabPipeline') },
		{ id: 'challenges' as const, label: t('tabChallenges') },
		{ id: 'review' as const, label: t('tabReview') },
	];

	return (
		<>
			<div className='sticky top-0 z-20 -mx-4 border-b border-(--a42-border) bg-(--a42-bg)/95 px-4 pb-4 pt-2 backdrop-blur-sm md:mx-0 md:px-0'>
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
					<CollapsibleMobileUploader
						mobileOpen={mobileUploaderOpen}
						setMobileOpen={setMobileUploaderOpen}
					/>

					<RecruiterCard className='flex min-h-0 min-w-0 flex-col'>
						<SectionLabel>{t('yourJobPosts')}</SectionLabel>
						<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
							{tJob('listDescription')}
						</p>
						<div className='mt-5 min-h-0 flex-1'>
							{statJobPosts === 0 ? (
								<EmptyState
									eyebrow={t('firstTimePipelineEyebrow')}
									title={t('firstTimePipelineTitle')}
									description={t('firstTimePipelineBody')}
									cta={t('firstTimePipelineCta')}
									onCtaClick={scrollToUploader}
								/>
							) : (
								<JobPostList
									key={statJobPosts}
									embedded
									showHeader={false}
								/>
							)}
						</div>
                    </RecruiterCard>
                </RecruiterTabPanel>

				<RecruiterTabPanel id='challenges'>
					<RecruiterDashboardChallengesTab />
				</RecruiterTabPanel>

				<RecruiterTabPanel id='review'>
					<RecruiterCandidatesReview
						embedded
						onEmptyReviewCta={() => setTab('challenges')}
					/>
				</RecruiterTabPanel>
			</div>
		</>
	);
}

export function RecruiterUnifiedDashboardClient(
	props: RecruiterUnifiedDashboardClientProps,
) {
	return (
		<RecruiterTabProvider>
			<RecruiterUnifiedDashboardInner {...props} />
		</RecruiterTabProvider>
	);
}
