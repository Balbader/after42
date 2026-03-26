import DOMPurify from 'isomorphic-dompurify';
import { Marked, type Token, type Tokens } from 'marked';

export type ChallengeBriefTocItem = { id: string; label: string; depth: number };

function slugify(s: string): string {
	const slug = s
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
	return slug.slice(0, 80) || 'section';
}

/** Plain label for TOC / slugging from inline tokens. */
function plainTextFromInline(tokens: Token[] | undefined): string {
	if (!tokens?.length) return '';
	let out = '';
	for (const t of tokens) {
		switch (t.type) {
			case 'text':
				out += (t as Tokens.Text).text;
				break;
			case 'codespan':
				out += (t as Tokens.Codespan).text;
				break;
			case 'strong':
			case 'em':
			case 'del':
				out += plainTextFromInline((t as Tokens.Strong).tokens);
				break;
			case 'link':
			case 'image':
				out += plainTextFromInline((t as Tokens.Link).tokens);
				break;
			default:
				if ('tokens' in t && Array.isArray((t as { tokens?: Token[] }).tokens)) {
					out += plainTextFromInline((t as { tokens: Token[] }).tokens);
				}
				break;
		}
	}
	return out.trim();
}

/**
 * Renders challenge README markdown for the recruiter detail page: stable heading ids,
 * table of contents, and HTML safe for dangerouslySetInnerHTML.
 */
export async function renderRecruiterChallengeBrief(raw: string): Promise<{
	html: string;
	toc: ChallengeBriefTocItem[];
}> {
	const toc: ChallengeBriefTocItem[] = [];
	const slugCount = new Map<string, number>();

	const uniqueSlug = (label: string) => {
		const base = slugify(label);
		const next = (slugCount.get(base) ?? 0) + 1;
		slugCount.set(base, next);
		return next === 1 ? base : `${base}-${next}`;
	};

	const md = new Marked();
	md.use({
		renderer: {
			heading({ tokens, depth, text }) {
				const label = (text ?? '').trim() || plainTextFromInline(tokens);
				const inner = this.parser.parseInline(tokens);
				if (depth <= 3 && label.length > 0) {
					const id = uniqueSlug(label);
					toc.push({ id, label, depth });
					return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
				}
				return `<h${depth}>${inner}</h${depth}>\n`;
			},
		},
	});

	const html = String(await md.parse(raw, { async: true }));
	const safe = DOMPurify.sanitize(html);
	return { html: safe, toc };
}
