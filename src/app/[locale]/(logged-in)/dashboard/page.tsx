import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { eq, count } from 'drizzle-orm';

import { authController } from '@/bff/controllers/auth.controller';
import type { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { jobPost } from '@/db/schemas/job-post';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import {
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	RecruiterSecondaryLink,
	SectionLabel,
	SectionTitle,
} from '@/components/company';
import { RecruiterUnifiedDashboardClient } from '@/components/company/recruiter-unified-dashboard-client';
import { Link } from '@/i18n/navigation';

type PageProps = {
	params: Promise<{ locale: string }>;
};

function greetingKey(): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
	const h = new Date().getHours();
	if (h < 12) return 'greetingMorning';
	if (h < 18) return 'greetingAfternoon';
	return 'greetingEvening';
}

function DashboardRecruiterSkeleton() {
	return (
		<div className='mt-8 space-y-6'>
			<div className='h-24 animate-pulse rounded-2xl bg-(--a42-surface-2)' />
			<div className='h-48 animate-pulse rounded-2xl bg-(--a42-surface-2)' />
		</div>
	);
}

export default async function DashboardPage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations('dashboard');
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
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-(--a42-text-muted)'>
					{t('candidateLead')}
				</p>
				<div className='mt-8 rounded-lg border border-(--a42-border) bg-(--a42-surface) p-6'>
					<SectionLabel>{t('nextStep')}</SectionLabel>
					<h2 className='mt-1 font-(family-name:--font-dm-sans) text-base font-medium text-(--a42-text)'>
						{t('browseTitle')}
					</h2>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-(--a42-text-muted)'>
						{t('browseBody')}
					</p>
					<Link
						href='/candidate/challenges'
						className='mt-3 inline-block font-(family-name:--font-dm-sans) text-[13px] font-medium text-(--a42-accent) hover:underline'
					>
						{t('browseLink')}
					</Link>
				</div>
			</div>
		);
	}
    const [jobPostCount, challengeCount, submissionStats] = await Promise.all([
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
						{t('recruiterLeadUnified')}{' '}
						<span className='text-(--a42-text-faint)'>{t('statsHint')}</span>
					</>
				}
				actions={
					<>
						<RecruiterPrimaryLink href='/dashboard?tab=pipeline'>
							{t('ctaNewJob')}
						</RecruiterPrimaryLink>
						<RecruiterSecondaryLink href='/dashboard?tab=challenges'>
							{t('ctaChallenges')}
						</RecruiterSecondaryLink>
						<RecruiterSecondaryLink href='/dashboard?tab=review'>
							{t('ctaCandidates')}
						</RecruiterSecondaryLink>
					</>
				}
			/>

			<Suspense fallback={<DashboardRecruiterSkeleton />}>
                <RecruiterUnifiedDashboardClient
                    statJobPosts={jobPostCount}
                    statChallenges={challengeCount}
                    statCandidates={submissionStats.total}
                    statScored={submissionStats.scored}
                />
			</Suspense>
		</RecruiterPage>
	);
}
