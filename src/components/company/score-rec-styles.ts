export type Recommendation = 'recommend' | 'consider' | 'pass';

/** Borders use light tints; fills/text use theme tokens (light + dark via globals `.dark`). */
export const REC_COLORS: Record<Recommendation, string> = {
	recommend:
		'border-emerald-200/90 bg-[var(--a42-score-high-bg)] text-[color:var(--a42-score-high)] dark:border-emerald-800/80',
	consider:
		'border-amber-200/90 bg-[var(--a42-score-mid-bg)] text-[color:var(--a42-score-mid)] dark:border-amber-800/80',
	pass: 'border-red-200/90 bg-[var(--a42-score-low-bg)] text-[color:var(--a42-score-low)] dark:border-red-900/80',
};

/** CSS color for inline `style` — uses design tokens (adapts in dark mode). */
export function scoreHex(score: number): string {
	if (score >= 80) return 'var(--a42-score-high)';
	if (score >= 60) return 'var(--a42-score-mid)';
	return 'var(--a42-score-low)';
}

export function scoreClass(score: number): string {
	if (score >= 80) return 'text-[color:var(--a42-score-high)]';
	if (score >= 60) return 'text-[color:var(--a42-score-mid)]';
	return 'text-[color:var(--a42-score-low)]';
}
