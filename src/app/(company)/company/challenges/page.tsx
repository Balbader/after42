import Link from 'next/link';
import { count, desc, eq, inArray, max } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';
import { ChevronRight } from 'lucide-react';
import {
	SectionLabel,
	SectionTitle,
	StatusBadge,
	ScoreBadge,
	EmptyState,
} from '@/components/company/ui';

export default async function ChallengesPage() {
	const sessionUser = await requireRole('recruiter');

	const challenges = await db
		.select()
		.from(challenge)
		.where(eq(challenge.creatorId, sessionUser.id))
		.orderBy(desc(challenge.createdAt));

	if (challenges.length === 0) {
		return (
			<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
				<SectionLabel>Challenges</SectionLabel>
				<SectionTitle className='mt-2'>Your challenges</SectionTitle>
				<EmptyState
					title='No challenges yet.'
					description='Generate your first challenge from a job post.'
					href='/challenge/create'
					cta='Upload a job post →'
				/>
			</div>
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
		<div className='mx-auto w-full max-w-3xl px-4 pt-8'>
			<SectionLabel>Challenges</SectionLabel>
			<SectionTitle className='mt-2'>Your challenges</SectionTitle>
			<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				{challenges.length} challenge{challenges.length !== 1 ? 's' : ''} ·{' '}
				{totalCandidates} total candidate{totalCandidates !== 1 ? 's' : ''}
			</p>

			<div className='mt-8 space-y-3'>
				{challenges.map((ch) => {
					const stats = statsMap.get(ch.id);
					const n = stats?.n ?? 0;
					const topScore = stats?.topScore ?? null;
					const created = ch.createdAt
						? formatDistanceToNow(ch.createdAt, { addSuffix: true })
						: '';

					return (
						<Link
							key={ch.id}
							href={`/company/challenges/${ch.id}/submissions`}
							className='group block rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-5 transition-colors hover:bg-[#F5F4F1]'
						>
							<div className='flex items-start justify-between gap-4'>
								<div className='min-w-0 flex-1'>
									<p className='font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
										{ch.title}
									</p>
									<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
										{ch.seniority_level} · {parseTechStack(ch.tech_stack)}
									</p>
								</div>
								<StatusBadge status={ch.status} />
							</div>

							<div className='mt-3 flex items-center gap-4'>
								<span className='font-(family-name:--font-dm-sans) text-[13px] tabular-nums text-[#78716C]'>
									{n} submission{n !== 1 ? 's' : ''}
								</span>
								{topScore !== null && (
									<span className='flex items-center gap-1.5 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
										Top score: <ScoreBadge score={topScore} size='sm' />
									</span>
								)}
								<span className='font-(family-name:--font-dm-sans) text-[13px] text-[#A8A29E]'>
									{created}
								</span>
								<span className='ml-auto flex items-center gap-1 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] opacity-0 transition-opacity group-hover:opacity-100'>
									View submissions
									<ChevronRight className='size-3.5' />
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
