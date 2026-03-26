import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export async function renderMarkdown(raw: string): Promise<string> {
	const html = String(await marked.parse(raw, { async: true }));
	return DOMPurify.sanitize(html);
}
