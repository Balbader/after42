import Link from 'next/link';
import { count, desc, eq, inArray } from 'drizzle-orm';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { parseTechStack } from '@/lib/parse-tech-stack';
import { requireRole } from '@/lib/require-role';
import { ChevronRight } from 'lucide-react';

function StatusPill({ status }: { status: string }) {
	if (status === 'active') {
		return (
			<span className='rounded-full border border-[#86EFAC] bg-[#F0FDF4] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#16A34A]'>
				Active
			</span>
		);
	}
	return (
		<span className='rounded-full border border-[#E7E5E4] bg-[#F5F4F1] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#78716C]'>
			Draft
		</span>
	);
}

export default async function Page() {
	const sessionUser = await requireRole('recruiter');

	const challenges = await db
		.select()
		.from(challenge)
		.where(eq(challenge.creatorId, sessionUser.id))
		.orderBy(desc(challenge.createdAt));

	const ids = challenges.map((c) => c.id);
	const countByChallenge = new Map<string, number>();
	if (ids.length > 0) {
		const countRows = await db
			.select({
				challengeId: candidateSubmission.challengeId,
				n: count(),
			})
			.from(candidateSubmission)
			.where(inArray(candidateSubmission.challengeId, ids))
			.groupBy(candidateSubmission.challengeId);
		for (const row of countRows) {
			countByChallenge.set(row.challengeId, row.n);
		}
	}

	if (challenges.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-16 text-center'>
				<p className='font-(family-name:--font-fraunces) text-[22px] italic text-[#A8A29E]'>
					No challenges yet.
				</p>
				<p className='mt-3 max-w-md font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					Generate your first challenge from a job post.
				</p>
				<Link
					href='/challenge/create'
					className='mt-2 inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412]'
				>
					Upload a job post →
				</Link>
			</div>
		);
	}

	return (
		<div className='w-full min-w-0'>
			<h1 className='mb-6 font-(family-name:--font-dm-sans) text-[22px] font-medium text-[#1C1917]'>
				My Challenges
			</h1>
			<ul className='divide-y divide-[#E7E5E4] border-y border-[#E7E5E4]'>
				{challenges.map((ch) => {
					const n = countByChallenge.get(ch.id) ?? 0;
					const meta = `${ch.seniority_level} · ${parseTechStack(ch.tech_stack)}`;
					return (
						<li key={ch.id}>
							<Link
								href={`/company/challenges/${ch.id}`}
								className='group flex flex-wrap items-center justify-between gap-4 px-3 py-4 transition-colors hover:bg-[#F5F4F1]'
							>
								<div className='min-w-0 flex-1'>
									<p className='font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917]'>
										{ch.title}
									</p>
									<p className='mt-1 font-(family-name:--font-dm-sans) text-xs text-[#78716C]'>
										{meta}
									</p>
								</div>
								<div className='flex shrink-0 items-center gap-4'>
									<span className='font-(family-name:--font-dm-sans) text-[13px] tabular-nums text-[#78716C]'>
										{n} submissions
									</span>
									<div className='flex items-center gap-2'>
										<StatusPill status={ch.status} />
										<span className='flex items-center gap-1 font-(family-name:--font-dm-sans) text-sm text-[#C2410C] group-hover:text-[#9A3412]'>
											View submissions
											<ChevronRight className='size-4' />
										</span>
									</div>
								</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
