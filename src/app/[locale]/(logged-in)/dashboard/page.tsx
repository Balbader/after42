import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { desc, eq, count } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';

import { authController } from '@/bff/controllers/auth.controller';
import type { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { jobPost } from '@/db/schemas/job-post';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { JobPostList } from '@/components/job-post/job-post-list';
import {
	RecruiterCard,
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	RecruiterSecondaryLink,
	SectionLabel,
	SectionTitle,
	StatCard,
	StatusBadge,
} from '@/components/company';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

type PageProps = {
	params: Promise<{ locale: string }>;
};

function greetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
	const h = new Date().getHours();
	if (h < 12) return 'greetingMorning';
	if (h < 18) return 'greetingAfternoon';
	return 'greetingEvening';
}

export default async function DashboardPage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('dashboard');
	const tJob = await getTranslations('jobPost');
	const { user } = await authController.requireSession(await headers());
	const u = user as User;
	const firstName = u.name?.split(' ')[0] ?? t('there');

	if (u.role === 'candidate') {
		return (
			<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
				<SectionLabel>{t('label')}</SectionLabel>
				<SectionTitle className='mt-2'>
					{t(greetingKey())}, {firstName}.
				</SectionTitle>
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					{t('candidateLead')}
				</p>
				<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
					<SectionLabel>{t('nextStep')}</SectionLabel>
					<h2 className='mt-1 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
						{t('browseTitle')}
					</h2>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
						{t('browseBody')}
					</p>
					<Link
						href='/candidate/challenges'
						className='mt-3 inline-block font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] hover:underline'
					>
						{t('browseLink')}
					</Link>
				</div>
			</div>
		);
	}

	const [jobPostCount, challengeCount, submissionStats, recentChallenges] = await Promise.all([
		db
			.select({ n: count() })
			.from(jobPost)
			.where(eq(jobPost.recruiterId, u.id))
			.then((r) => r[0]?.n ?? 0),
		db
			.select({ n: count() })
			.from(challenge)
			.where(eq(challenge.creatorId, u.id))
			.then((r) => r[0]?.n ?? 0),
		db
			.select({
				total: count(),
				scored: count(candidateSubmission.score),
			})
			.from(candidateSubmission)
			.innerJoin(challenge, eq(candidateSubmission.challengeId, challenge.id))
			.where(eq(challenge.creatorId, u.id))
			.then((r) => ({ total: r[0]?.total ?? 0, scored: r[0]?.scored ?? 0 })),
		db
			.select({
				id: challenge.id,
				title: challenge.title,
				status: challenge.status,
				createdAt: challenge.createdAt,
			})
			.from(challenge)
			.where(eq(challenge.creatorId, u.id))
			.orderBy(desc(challenge.createdAt))
			.limit(6),
	]);

	return (
		<RecruiterPage>
			<RecruiterPageHeader
				eyebrow={t('label')}
				title={
					<>
						{t(greetingKey())}, {firstName}.
					</>
				}
				description={
					<>
						{t('recruiterLead')}{' '}
						<span className='text-[#A8A29E]'>{t('statsHint')}</span>
					</>
				}
				actions={
					<>
						<RecruiterPrimaryLink href='/challenge/create'>
							{t('ctaNewJob')}
						</RecruiterPrimaryLink>
						<RecruiterSecondaryLink href='/company/challenges'>
							{t('ctaChallenges')}
						</RecruiterSecondaryLink>
						<RecruiterSecondaryLink href='/company/candidates'>
							{t('ctaCandidates')}
						</RecruiterSecondaryLink>
					</>
				}
			/>

			<div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
				<StatCard label={t('statJobPosts')} value={jobPostCount} />
				<StatCard label={t('statChallenges')} value={challengeCount} />
				<StatCard label={t('statCandidates')} value={submissionStats.total} />
				<StatCard label={t('statScored')} value={submissionStats.scored} />
			</div>

			<div className='mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:items-start'>
				<div className='flex min-w-0 flex-col gap-8'>
					<RecruiterCard>
						<SectionLabel>{t('uploadSection')}</SectionLabel>
						<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
							{t('uploadLead')}
						</p>
						<div className='mt-5'>
							<JobPostUploader embedded />
						</div>
					</RecruiterCard>

					<RecruiterCard>
						<SectionLabel>{t('yourJobPosts')}</SectionLabel>
						<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
							{tJob('listDescription')}
						</p>
						<div className='mt-5'>
							<JobPostList embedded showHeader={false} />
						</div>
					</RecruiterCard>
				</div>

				<aside className='min-w-0'>
					<RecruiterCard className='lg:sticky lg:top-4'>
						<div className='flex items-start justify-between gap-3'>
							<div>
								<SectionLabel>{t('pipelineTitle')}</SectionLabel>
								<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
									{t('pipelineLead')}
								</p>
							</div>
							<Link
								href='/company/challenges'
								className='shrink-0 font-(family-name:--font-dm-sans) text-[12px] font-medium text-[#C2410C] hover:underline'
							>
								{t('ctaChallenges')}
							</Link>
						</div>

						{recentChallenges.length === 0 ? (
							<div className='mt-5 rounded-xl border border-dashed border-[#E7E5E4] bg-[#FAFAF8] p-5'>
								<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
									{t('pipelineEmpty')}
								</p>
								<Link
									href='/challenge/create'
									className='mt-3 inline-flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] hover:underline'
								>
									{t('pipelineCreate')}
									<ChevronRight className='size-3.5' />
								</Link>
							</div>
						) : (
							<ul className='mt-5 divide-y divide-[#E7E5E4] rounded-xl border border-[#E7E5E4] bg-[#FAFAF8]'>
								{recentChallenges.map((ch) => {
									const created = ch.createdAt
										? formatDistanceToNow(ch.createdAt, { addSuffix: true })
										: '';
									return (
										<li key={ch.id}>
											<div className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
												<div className='min-w-0'>
													<p className='truncate font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#1C1917]'>
														{ch.title}
													</p>
													<div className='mt-1 flex flex-wrap items-center gap-2'>
														<StatusBadge status={ch.status} />
														<span className='font-(family-name:--font-dm-sans) text-[11px] text-[#A8A29E]'>
															{created}
														</span>
													</div>
												</div>
												<div className='flex shrink-0 gap-2'>
													<Link
														href={`/company/challenges/${ch.id}`}
														className='rounded-md border border-[#E7E5E4] bg-[#FFFFFF] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-[11px] font-medium text-[#57534E] transition-colors hover:border-[#D6D3D1]'
													>
														{t('pipelineOpen')}
													</Link>
													<Link
														href={`/company/challenges/${ch.id}/submissions`}
														className='rounded-md bg-[#C2410C] px-2.5 py-1.5 font-(family-name:--font-dm-sans) text-[11px] font-medium text-white transition-colors hover:bg-[#9A3412]'
													>
														{t('pipelineReview')}
													</Link>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</RecruiterCard>
				</aside>
			</div>
		</RecruiterPage>
	);
}
