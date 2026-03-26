import { and, count, desc, eq, sql } from 'drizzle-orm';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SubmissionsClickableRow, type SubmissionRowData } from '@/components/company';
import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';
import {
	SectionLabel,
	SectionTitle,
	EmptyState,
} from '@/components/company/ui';

export default async function SubmissionsPage({
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

	if (!ch || ch.creatorId !== sessionUser.id) notFound();

	const [rows, [totalAgg], [scoredAgg]] = await Promise.all([
		db
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
			),
		db
			.select({ total: count() })
			.from(candidateSubmission)
			.where(eq(candidateSubmission.challengeId, challengeId)),
		db
			.select({ scored: count() })
			.from(candidateSubmission)
			.where(
				and(
					eq(candidateSubmission.challengeId, challengeId),
					eq(candidateSubmission.status, 'scored'),
				),
			),
	]);

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
		<div className='mx-auto w-full max-w-4xl px-4 pt-8'>
			<Link
				href={`/company/challenges/${challengeId}`}
				className='font-(family-name:--font-dm-sans) text-[13px] text-[#78716C] hover:text-[#1C1917]'
			>
				← {ch.title}
			</Link>

			<div className='mt-6'>
				<SectionLabel>Submissions</SectionLabel>
				<SectionTitle className='mt-2'>{ch.title}</SectionTitle>
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					{total} total · {scored} scored
				</p>
			</div>

			{rows.length === 0 ? (
				<EmptyState
					title='No submissions yet.'
					description='Candidates will appear here once they fork the challenge.'
				/>
			) : (
				<div className='mt-8 overflow-x-auto rounded-lg border border-[#E7E5E4]'>
					<table className='w-full min-w-[640px] border-collapse text-left'>
						<thead>
							<tr className='border-b border-[#E7E5E4] bg-[#F5F4F1]'>
								{['Rank', 'Candidate', 'Score', 'Recommendation', 'Status', 'Submitted'].map(
									(h) => (
										<th
											key={h}
											className='px-3 py-2.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'
										>
											{h}
										</th>
									),
								)}
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
