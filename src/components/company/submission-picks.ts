import type { SubmissionRowData } from '@/components/company/submissions-table-row';

/** Up to `max` candidates: recommend first, then fill by score (for recruiter “start here”). */
export function pickSubmissionTopRows(
	rows: SubmissionRowData[],
	max = 3,
): SubmissionRowData[] {
	const scored = rows.filter((r) => r.status === 'scored' && r.score != null);
	const recs = scored.filter((r) => r.recommendation === 'recommend');
	const out: SubmissionRowData[] = [];
	const seen = new Set<string>();
	for (const r of recs) {
		if (out.length >= max) break;
		out.push(r);
		seen.add(r.id);
	}
	const rest = [...scored].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
	for (const r of rest) {
		if (out.length >= max) break;
		if (!seen.has(r.id)) {
			out.push(r);
			seen.add(r.id);
		}
	}
	return out;
}
