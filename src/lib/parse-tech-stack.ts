/** Parse JSON array tech_stack from DB into a comma-separated label. */
export function parseTechStack(raw: string): string {
	try {
		const arr = JSON.parse(raw) as unknown;
		return Array.isArray(arr) ? arr.join(', ') : raw;
	} catch {
		return raw;
	}
}
