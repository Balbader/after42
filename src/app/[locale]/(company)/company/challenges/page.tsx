import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { count, desc, eq, inArray, max } from 'drizzle-orm';

export const metadata: Metadata = {
	title: 'Challenges — after42',
	description: 'Manage your coding challenges and track candidate submissions.',
};
import { formatDistanceToNow } from 'date-fns';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ChevronRight } from 'lucide-react';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';
import {
	EmptyState,
	RecruiterCard,
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
	ScoreBadge,
	StatusBadge,
} from '@/components/company';

type PageProps = { params: Promise<{ locale: string }> };

export default async function ChallengesPage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('company');

	const sessionUser = await requireRole('recruiter');

	const challenges = await db
		.select()
		.from(challenge)
		.where(eq(challenge.creatorId, sessionUser.id))
		.orderBy(desc(challenge.createdAt));

	if (challenges.length === 0) {
		return (
			<RecruiterPage>
				<RecruiterPageHeader
					eyebrow={t('challengesTitle')}
					title={t('challengesTitle')}
					description={t('challengesLead')}
					actions={<RecruiterPrimaryLink href='/challenge/create'>{t('createChallenge')}</RecruiterPrimaryLink>}
				/>
				<EmptyState
					title={t('challengesEmptyTitle')}
					description={t('challengesEmptyDesc')}
					href='/challenge/create'
					cta={t('challengesEmptyCta')}
				/>
			</RecruiterPage>
		);
	}

	const ids = challenges.map((c) => c.id);
	const statsRows = await db
		.select({
			challengeId: candidateSubmission.challengeId,
			n: count(),
			topScore: max(candidateSubmission.score),
		})
		.from(candidateSubmission)
		.where(inArray(candidateSubmission.challengeId, ids))
		.groupBy(candidateSubmission.challengeId);

	const statsMap = new Map(statsRows.map((r) => [r.challengeId, r]));
	const totalCandidates = statsRows.reduce((s, r) => s + r.n, 0);

	return (
		<RecruiterPage>
			<RecruiterPageHeader
				eyebrow={t('challengesTitle')}
				title={t('challengesTitle')}
				description={t('challengesLead')}
				actions={<RecruiterPrimaryLink href='/challenge/create'>{t('createChallenge')}</RecruiterPrimaryLink>}
			/>

			<p className='mt-2 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				{t('challengesSummary', {
					challengeCount: challenges.length,
					candidateCount: totalCandidates,
				})}
			</p>

			<div className='mt-8 grid gap-4 sm:grid-cols-2'>
				{challenges.map((ch) => {
					const stats = statsMap.get(ch.id);
					const n = stats?.n ?? 0;
					const topScore = stats?.topScore ?? null;
					const created = ch.createdAt
						? formatDistanceToNow(ch.createdAt, { addSuffix: true })
						: '';

					return (
						<RecruiterCard key={ch.id} className='group flex flex-col p-0' padding='none'>
							<div className='flex flex-1 flex-col p-5 md:p-6'>
								<div className='flex items-start justify-between gap-3'>
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
									<StatusBadge status={ch.status} />
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
		</RecruiterPage>
	);
}
