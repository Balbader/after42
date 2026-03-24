import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';

import { challenge } from '@/db/schemas/challenge';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { db } from '@/db';
import { requireRole } from '@/lib/require-role';
import { ChevronRight } from 'lucide-react';

function parseTechStack(raw: string): string {
	try {
		const arr = JSON.parse(raw) as unknown;
		return Array.isArray(arr) ? arr.join(', ') : raw;
	} catch {
		return raw;
	}
}

function rowHref(
	challengeId: string,
	sub?: { status: string; submissionId: string },
): string {
	if (!sub) return `/candidate/challenges/${challengeId}`;
	if (['forked', 'submitted', 'scoring'].includes(sub.status)) {
		return `/candidate/challenges/${challengeId}/submit`;
	}
	return `/candidate/challenges/${challengeId}`;
}

export default async function Page() {
	const sessionUser = await requireRole('candidate');

	const challenges = await db
		.select()
		.from(challenge)
		.where(eq(challenge.status, 'active'))
		.orderBy(desc(challenge.createdAt));

	const subs = await db
		.select({
			challengeId: candidateSubmission.challengeId,
			status: candidateSubmission.status,
			submissionId: candidateSubmission.id,
		})
		.from(candidateSubmission)
		.where(eq(candidateSubmission.candidateId, sessionUser.id));

	const subByChallenge = new Map<
		string,
		{ status: string; submissionId: string }
	>();
	for (const s of subs) {
		subByChallenge.set(s.challengeId, {
			status: s.status,
			submissionId: s.submissionId,
		});
	}

	if (challenges.length === 0) {
		return (
			<div className='flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 text-center'>
				<p className='font-(family-name:--font-fraunces) text-xl italic text-[#A8A29E]'>
					No challenges yet.
				</p>
				<p className='mt-3 max-w-md font-(family-name:--font-dm-sans) text-base text-[#A8A29E]'>
					You&apos;ll be notified when a challenge becomes available.
				</p>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-3xl px-4 py-8'>
			<h1 className='font-(family-name:--font-dm-sans) text-[22px] font-medium text-[#1C1917]'>
				Challenges
			</h1>
			<ul className='mt-8 divide-y divide-[#E7E5E4] border-y border-[#E7E5E4]'>
				{challenges.map((ch) => {
					const sub = subByChallenge.get(ch.id);
					const href = rowHref(ch.id, sub);
					const meta = `${ch.seniority_level} · ${parseTechStack(ch.tech_stack)}`;
					return (
						<li key={ch.id}>
							<Link
								href={href}
								className='group flex items-center justify-between gap-4 px-3 py-4 transition-colors hover:bg-[#F5F4F1]'
							>
								<div className='min-w-0 flex-1'>
									<p className='font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917]'>
										{ch.title}
									</p>
									<p className='mt-1 font-(family-name:--font-dm-sans) text-xs text-[#78716C]'>
										{meta}
									</p>
								</div>
								<div className='flex shrink-0 items-center gap-2'>
									<StatusBadge status={sub?.status} />
									<ChevronRight className='size-4 text-[#A8A29E] transition-transform group-hover:translate-x-0.5' />
								</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function StatusBadge({ status }: { status?: string }) {
	if (!status) return null;
	if (['forked', 'submitted', 'scoring'].includes(status)) {
		return (
			<span className='rounded border border-[#FDBA74] bg-[#FFF7ED] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#C2410C]'>
				In Progress
			</span>
		);
	}
	if (status === 'scored') {
		return (
			<span className='rounded border border-[#86EFAC] bg-[#F0FDF4] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#16A34A]'>
				Scored
			</span>
		);
	}
	if (status === 'failed') {
		return (
			<span className='rounded border border-[#FCA5A5] bg-[#FEF2F2] px-1 py-0.5 font-(family-name:--font-dm-sans) text-[11px] font-semibold uppercase text-[#DC2626]'>
				Failed
			</span>
		);
	}
	return null;
}
