export type Recommendation = 'recommend' | 'consider' | 'pass';

export const REC_COLORS: Record<Recommendation, string> = {
	recommend: 'border-[#86EFAC] bg-[#F0FDF4] text-[#16A34A]',
	consider: 'border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]',
	pass: 'border-[#FCA5A5] bg-[#FEF2F2] text-[#DC2626]',
};

export function scoreHex(score: number): string {
	if (score >= 80) return '#16A34A';
	if (score >= 60) return '#D97706';
	return '#DC2626';
}

export function scoreClass(score: number): string {
	if (score >= 80) return 'text-[#16A34A]';
	if (score >= 60) return 'text-[#D97706]';
	return 'text-[#DC2626]';
}
