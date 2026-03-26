import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { eq, count } from 'drizzle-orm';

import { authController } from '@/bff/controllers/auth.controller';
import type { User } from '@/bff/models/user.model';
import { db } from '@/db';
import { jobPost } from '@/db/schemas/job-post';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { JobPostList } from '@/components/job-post/job-post-list';
import {
	SectionLabel,
	SectionTitle,
	StatCard,
} from '@/components/company/ui';
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
		<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
			<SectionLabel>{t('label')}</SectionLabel>
			<SectionTitle className='mt-2'>
				{t(greetingKey())}, {firstName}.
			</SectionTitle>
			<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				{t('recruiterLead')}
			</p>

			<div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
				<StatCard label={t('statJobPosts')} value={jobPostCount} />
				<StatCard label={t('statChallenges')} value={challengeCount} />
				<StatCard label={t('statCandidates')} value={submissionStats.total} />
				<StatCard label={t('statScored')} value={submissionStats.scored} />
			</div>

			<section className='mt-10'>
				<SectionLabel>{t('uploadSection')}</SectionLabel>
				<p className='mt-1 mb-4 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
					{t('uploadLead')}
				</p>
				<JobPostUploader recruiterId={u.id} />
			</section>

			<section className='mt-10'>
				<SectionLabel>{t('yourJobPosts')}</SectionLabel>
				<div className='mt-3'>
					<JobPostList recruiterId={u.id} />
				</div>
			</section>
		</div>
	);
}
