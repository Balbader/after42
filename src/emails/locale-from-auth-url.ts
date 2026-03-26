/**
 * Infer email copy locale from Better Auth URLs when they include an `/fr/`
 * segment (next-intl), including encoded callback/redirect query params.
 */
export function localeFromAuthUrl(url: string): 'en' | 'fr' {
	try {
		const u = new URL(url);
		const chunks: string[] = [u.pathname + u.search, u.href];
		for (const key of ['callbackURL', 'redirect', 'redirectTo']) {
			const raw = u.searchParams.get(key);
			if (raw) {
				try {
					chunks.push(decodeURIComponent(raw));
				} catch {
					chunks.push(raw);
				}
			}
		}
		for (const s of chunks) {
			if (s.includes('/fr/') || s.includes('/fr?')) return 'fr';
		}
		return 'en';
	} catch {
		return 'en';
	}
}
