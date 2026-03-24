import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/** Output schema for submission scoring (also used by the DB layer). */
export const submissionScorerOutputSchema = z.object({
	score: z.number().min(0).max(100),
	recommendation: z.enum(['recommend', 'consider', 'pass']),
	recommendationNote: z.string().describe('1-2 sentence summary for recruiters'),
	strengths: z.array(z.string()).min(3).max(5),
	gaps: z.array(z.string()).max(5),
});

export type SubmissionScorerOutput = z.infer<typeof submissionScorerOutputSchema>;

const challengeSpecSchema = z.object({
	title: z.string(),
	readme: z.string(),
	evaluationCriteria: z.array(z.string()),
});

const jobContextSchema = z.object({
	experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']),
	requiredSkills: z.array(z.string()),
});

const submissionScorerInputSchema = z.object({
	challenge: challengeSpecSchema,
	candidateCode: z.string(),
	jobPost: jobContextSchema,
});

/**
 * Scores candidate code against the challenge and job requirements.
 * Uses Claude Sonnet with structured output; calibration: 90+ exceptional, 70-89 solid, 50-69 gaps, below 50 pass.
 */
export const submissionScorerTool = createTool({
	id: 'score-submission',
	description:
		'Score a candidate submission against challenge criteria and job required skills; returns score, recommendation, strengths, and gaps',

	inputSchema: submissionScorerInputSchema,

	outputSchema: submissionScorerOutputSchema,

	execute: async ({ challenge, candidateCode, jobPost }) => {
		const { generateObject } = await import('ai');
		const { createAnthropic } = await import('@ai-sdk/anthropic');

		const anthropic = createAnthropic({
			apiKey: process.env.ANTHROPIC_API_KEY,
		});

		const model = anthropic('claude-sonnet-4-5-20250929');

		const systemPrompt = `You are an expert technical interviewer scoring a take-home submission.

Evaluate against:
- The challenge README (intent and constraints)
- The INTERNAL evaluationCriteria (prioritize these)
- Code quality, correctness, architecture, tests, edge cases
- Fit with job requiredSkills and experienceLevel

SCORING CALIBRATION (strict):
- 90–100: Genuinely impressive; production-minded; few flaws
- 70–89: Solid professional work; minor gaps
- 50–69: Significant gaps or risks
- Below 50: Clear pass — major issues

RECOMMENDATION:
- "recommend": Strong hire signal for this challenge (typically 80+ if criteria met)
- "consider": Mixed; worth human follow-up
- "pass": Do not advance

strengths: 3–5 specific bullets. gaps: 0–5 specific bullets (empty if none).
recommendationNote: 1–2 sentences, plain and decisive.`;

		const prompt = `## Challenge title
${challenge.title}

## Challenge README (candidate-facing)
${challenge.readme}

## Internal evaluation criteria
${challenge.evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

## Job context
- experienceLevel: ${jobPost.experienceLevel}
- requiredSkills: ${jobPost.requiredSkills.join(', ')}

## Candidate submission (full code / key files concatenated)
\`\`\`
${candidateCode}
\`\`\`

Score the submission and return structured JSON matching the schema.`;

		try {
			const { object } = await generateObject({
				model,
				schema: submissionScorerOutputSchema,
				system: systemPrompt,
				prompt,
			});

			return object;
		} catch (error) {
			throw new Error(
				`Failed to score submission: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	},
});
