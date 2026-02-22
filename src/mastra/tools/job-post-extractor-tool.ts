import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Schema for structured job post data
 */
export const jobPostSchema = z.object({
  title: z.string().describe('Job title (e.g., "Senior Full Stack Developer")'),
  company: z.string().describe('Company name'),
  description: z.string().describe('Full job description'),

  location: z.string().optional().describe('Job location (city, country)'),
  remote: z.boolean().default(false).describe('Whether the job is remote'),

  type: z
    .enum(['full-time', 'part-time', 'contract', 'internship'])
    .describe('Employment type'),

  experienceLevel: z
    .enum(['junior', 'mid', 'senior', 'lead'])
    .describe('Required experience level'),

  requiredSkills: z
    .array(z.string())
    .describe('Required technical skills and hard requirements (e.g., ["React", "TypeScript", "Node.js"])'),

  niceToHaveSkills: z
    .array(z.string())
    .default([])
    .describe('Preferred or bonus skills'),

  responsibilities: z
    .array(z.string())
    .default([])
    .describe('Key job responsibilities and duties'),

  salary: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional().describe('Currency code (e.g., USD, EUR)'),
    })
    .optional()
    .describe('Salary range if mentioned'),
});

export type JobPostData = z.infer<typeof jobPostSchema>;

/**
 * Mastra tool for extracting structured data from job posting text.
 * Uses AI to parse unstructured text into a consistent JSON format.
 */
export const jobPostExtractorTool = createTool({
  id: 'extract-job-post',
  description: 'Extract and structure job posting information from raw text into a standardized JSON format',

  inputSchema: z.object({
    text: z.string().describe('Raw text extracted from the job posting file'),
    modelPreference: z
      .enum(['fast', 'accurate'])
      .default('fast')
      .describe('Processing preference: "fast" uses Haiku (cheaper), "accurate" uses Sonnet (better quality)'),
  }),

  outputSchema: jobPostSchema,

  execute: async ({ text, modelPreference }) => {
    const { generateObject } = await import('ai');
    const { createAnthropic } = await import('@ai-sdk/anthropic');

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Select model based on preference
    const model =
      modelPreference === 'accurate'
        ? anthropic('claude-sonnet-4-5-20250929')
        : anthropic('claude-haiku-4-5-20251001');

    const systemPrompt = `You are a job posting parser. Extract structured information from job postings.

CRITICAL INSTRUCTIONS:
1. Extract factual information only - do not hallucinate or invent details
2. If information is missing, use reasonable defaults or omit optional fields
3. For experienceLevel, infer from:
   - Years of experience mentioned (0-2 years = junior, 2-5 = mid, 5+ = senior, 8+ = lead)
   - Job title keywords (Junior/Associate = junior, Senior = senior, Lead/Staff/Principal = lead)
   - Default to "mid" if unclear
4. For type, default to "full-time" if not specified
5. Extract ALL technical skills mentioned (programming languages, frameworks, tools, methodologies)
6. Separate "required" (must-have, required, necessary) from "nice-to-have" (preferred, bonus, plus) skills
7. For salary:
   - Only include if explicitly mentioned with numbers
   - Convert salary ranges like "100k-120k" to min: 100000, max: 120000
   - Extract currency from context (default USD if in US, EUR if in Europe)
8. Keep responsibilities concise and actionable

OUTPUT FORMAT:
Return valid JSON matching the schema. Be thorough but accurate.`;

    try {
      const { object } = await generateObject({
        model,
        schema: jobPostSchema,
        system: systemPrompt,
        prompt: `Extract and structure this job posting:\n\n${text}`,
      });

      return object;
    } catch (error) {
      throw new Error(
        `Failed to extract job post data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
});
