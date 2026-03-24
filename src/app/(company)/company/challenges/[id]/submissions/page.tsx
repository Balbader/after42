import { and, count, desc, eq, sql } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
	SubmissionsClickableRow,
	type SubmissionRowData,
} from '@/components/company';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const sessionUser = await requireRole('recruiter');
	const { id: challengeId } = await params;

	const [ch] = await db
		.select()
		.from(challenge)
		.where(eq(challenge.id, challengeId))
		.limit(1);

	if (!ch || ch.creatorId !== sessionUser.id) {
		notFound();
	}

	const rows = await db
		.select({
			id: candidateSubmission.id,
			sequenceNum: candidateSubmission.sequenceNum,
			score: candidateSubmission.score,
			recommendation: candidateSubmission.recommendation,
			status: candidateSubmission.status,
			submittedAt: candidateSubmission.submittedAt,
		})
		.from(candidateSubmission)
		.where(eq(candidateSubmission.challengeId, challengeId))
		.orderBy(
			desc(sql`coalesce(${candidateSubmission.score}, -1)`),
			desc(candidateSubmission.submittedAt),
		);

	const [totalAgg] = await db
		.select({ total: count() })
		.from(candidateSubmission)
		.where(eq(candidateSubmission.challengeId, challengeId));

	const [scoredAgg] = await db
		.select({ scored: count() })
		.from(candidateSubmission)
		.where(
			and(
				eq(candidateSubmission.challengeId, challengeId),
				eq(candidateSubmission.status, 'scored'),
			),
		);

	const total = totalAgg?.total ?? 0;
	const scored = scoredAgg?.scored ?? 0;

	const tableRows: SubmissionRowData[] = rows.map((r) => ({
		id: r.id,
		sequenceNum: r.sequenceNum,
		score: r.score,
		recommendation: r.recommendation,
		status: r.status,
		submittedLabel: r.submittedAt
			? formatDistanceToNow(r.submittedAt, { addSuffix: true })
			: '—',
	}));

	return (
		<div className='w-full min-w-0'>
			<Link
				href={`/company/challenges/${challengeId}`}
				className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] hover:text-[#1C1917]'
			>
				← {ch.title}
			</Link>
			<h1 className='mt-4 font-(family-name:--font-dm-sans) text-[22px] font-medium text-[#1C1917]'>
				Submissions
			</h1>
			<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
				{total} total · {scored} scored
			</p>

			{rows.length === 0 ? (
				<div className='flex justify-center py-16'>
					<p className='font-(family-name:--font-fraunces) text-[22px] italic text-[#A8A29E]'>
						No submissions yet.
					</p>
				</div>
			) : (
				<div className='mt-8 overflow-x-auto'>
					<table className='w-full min-w-160 border-collapse text-left'>
						<thead>
							<tr className='border-b border-[#E7E5E4] bg-[#F5F4F1]'>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Rank
								</th>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Candidate
								</th>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Score
								</th>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Recommendation
								</th>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Status
								</th>
								<th className='px-3 py-2 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.04em] text-[#78716C] uppercase'>
									Submitted
								</th>
							</tr>
						</thead>
						<tbody>
							{tableRows.map((row, i) => (
								<SubmissionsClickableRow
									key={row.id}
									challengeId={challengeId}
									rank={i + 1}
									row={row}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
