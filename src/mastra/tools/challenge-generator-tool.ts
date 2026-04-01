import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/** Output schema for generated coding challenges (also used by the DB layer). */
export const challengeGeneratorOutputSchema = z.object({
  title: z.string().describe("Short, descriptive challenge title"),
  readme: z
    .string()
    .describe(
      "Full README.md for the candidate repo: problem statement, constraints, setup, submission — must NOT list internal evaluation criteria",
    ),
  starterCode: z
    .object({})
    .catchall(z.string())
    .describe("Map of file path to file contents for starter repo"),
  evaluationCriteria: z
    .array(z.string())
    .describe("Internal checklist for scoring — never exposed to candidates in the README"),
  estimatedDuration: z.string().describe('e.g. "4-6 hours"'),
  difficulty: z.enum(["junior", "mid", "senior"]),
  engineeringCategory: z
    .enum([
      "frontend",
      "backend",
      "full-stack",
      "blockchain",
      "devops",
      "mobile",
      "data",
      "security",
      "other",
    ])
    .describe(
      "Primary engineering discipline for the role/challenge (one best fit from job context)",
    ),
});

export type ChallengeGeneratorOutput = z.infer<typeof challengeGeneratorOutputSchema>;

const jobPostInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  requiredSkills: z.array(z.string()),
  experienceLevel: z.enum(["junior", "mid", "senior", "lead"]),
  techStack: z.array(z.string()).describe("Primary technologies for the role"),
});

/**
 * Generates a realistic take-home coding challenge from job post context.
 * Uses Claude Sonnet with structured output.
 */
export const challengeGeneratorTool = createTool({
  id: "generate-challenge",
  description:
    "Generate a tailored coding challenge (README, starter files, internal evaluation criteria) from job post data",

  inputSchema: jobPostInputSchema,

  outputSchema: challengeGeneratorOutputSchema,

  execute: async (jobPost) => {
    const { generateObject } = await import("ai");
    const { createAnthropic } = await import("@ai-sdk/anthropic");

    const anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const model = anthropic("claude-sonnet-4-5-20250929");

    const systemPrompt = `You design realistic take-home coding challenges for blind technical hiring.

RULES:
1. The challenge must test the skills in requiredSkills and align with techStack and experienceLevel.
2. starterCode must include enough structure that the candidate can run and extend the project (realistic paths like src/index.ts, package.json if applicable).
3. readme is for the CANDIDATE: explain the problem, constraints, how to run tests, and what a strong submission looks like in general terms. Do NOT copy or paraphrase evaluationCriteria into the README — those criteria are INTERNAL ONLY.
4. evaluationCriteria is INTERNAL for recruiters/scorers: specific, observable checks (correctness, edge cases, code quality dimensions). Number them clearly.
5. difficulty should match the role: junior = scoped scope; mid = multiple components; senior = system design tradeoffs or complex domain.
6. estimatedDuration should be honest for the scope (e.g. "3-5 hours", "4-6 hours").
7. engineeringCategory: pick the single best fit from title, description, requiredSkills, and techStack — frontend (UI/React/Vue/CSS); backend (APIs/services/databases); full-stack (clear end-to-end product ownership); blockchain (web3/smart contracts); devops/SRE (infra/K8s/CI/CD); mobile (iOS/Android/React Native); data (analytics/ML/pipelines); security (AppSec/infra security); other if none apply clearly.`;

    const userPayload = JSON.stringify(jobPost, null, 2);

    try {
      const { object } = await generateObject({
        model,
        schema: challengeGeneratorOutputSchema,
        system: systemPrompt,
        prompt: `Create a coding challenge for this job post:\n\n${userPayload}`,
      });

      return object;
    } catch (error) {
      throw new Error(
        `Failed to generate challenge: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
});
