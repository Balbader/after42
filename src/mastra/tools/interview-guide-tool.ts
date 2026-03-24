import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const interviewGuideItemSchema = z.object({
	question: z.string().describe('Question for HR to ask the candidate'),
	expected_answer: z
		.string()
		.describe('What a strong answer includes — plain English for a non-technical HR reader'),
	focus_area: z.string().optional().describe('e.g. Architecture, Testing, Problem Solving'),
});

/** Output schema for HR interview guide (also used by the DB layer). */
export const interviewGuideOutputSchema = z.object({
	guide: z.array(interviewGuideItemSchema).min(4).max(6),
});

export type InterviewGuideOutput = z.infer<typeof interviewGuideOutputSchema>;

const jobPostContextSchema = z.object({
	title: z.string(),
	experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']),
	requiredSkills: z.array(z.string()),
});

const challengeBriefSchema = z.object({
	title: z.string(),
	readme: z.string(),
});

const scorerBriefSchema = z.object({
	score: z.number(),
	strengths: z.array(z.string()),
	gaps: z.array(z.string()),
	recommendation: z.enum(['recommend', 'consider', 'pass']),
});

const interviewGuideInputSchema = z.object({
	jobPost: jobPostContextSchema,
	challenge: challengeBriefSchema,
	scorer: scorerBriefSchema,
});

/**
 * Produces 4–6 interview questions for HR, grounded in scorer strengths/gaps.
 * expected_answer text must be non-technical and jargon-free.
 */
export const interviewGuideTool = createTool({
	id: 'interview-guide',
	description:
		'Generate tailored HR interview questions and expected answers from job context, challenge, and scorer output',

	inputSchema: interviewGuideInputSchema,

	outputSchema: interviewGuideOutputSchema,

	execute: async ({ jobPost, challenge, scorer }) => {
		const { generateObject } = await import('ai');
		const { createAnthropic } = await import('@ai-sdk/anthropic');

		const anthropic = createAnthropic({
			apiKey: process.env.ANTHROPIC_API_KEY,
		});

		const model = anthropic('claude-sonnet-4-5-20250929');

		const systemPrompt = `You write interview guides for HR recruiters who are not engineers.

RULES:
1. Produce 4–6 questions tailored to THIS candidate's submission (use strengths and gaps from the scorer).
2. Balance probing gaps with exploring strengths — do not only focus on negatives.
3. Each question must be askable in a live interview by a non-technical person.
4. expected_answer must be plain English: no jargon, no acronyms unless explained. Say what ideas or behaviors indicate a strong answer.
5. focus_area is optional; use short labels like "Communication", "Testing mindset", "Tradeoffs".
6. Do not leak confidential internal scoring details — help HR have a useful conversation.`;

		const payload = JSON.stringify({ jobPost, challenge, scorer }, null, 2);

		try {
			const { object } = await generateObject({
				model,
				schema: interviewGuideOutputSchema,
				system: systemPrompt,
				prompt: `Create the interview guide from this context:\n\n${payload}`,
			});

			return object;
		} catch (error) {
			throw new Error(
				`Failed to generate interview guide: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	},
});
