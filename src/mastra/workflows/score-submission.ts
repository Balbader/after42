import { createStep, createWorkflow } from '@mastra/core/workflows';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { candidateSubmission } from '@/db/schemas/candidate-submission';
import { challenge } from '@/db/schemas/challenge';
import { jobPost } from '@/db/schemas/job-post';
import { logError } from '@/lib/log-helpers';
import { interviewGuideTool } from '@/mastra/tools/interview-guide-tool';
import {
	submissionScorerOutputSchema,
	submissionScorerTool,
	type SubmissionScorerOutput,
} from '@/mastra/tools/submission-scorer-tool';
import type { InterviewGuideOutput } from '@/mastra/tools/interview-guide-tool';

const workflowInputSchema = z.object({
	submissionId: z.string(),
	challengeId: z.string(),
	candidateCode: z.string(),
});

const scorerStepOutputSchema = z.object({
	submissionId: z.string(),
	challengeId: z.string(),
	scorerOutput: submissionScorerOutputSchema,
	jobPost: z.object({
		title: z.string(),
		experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']),
		requiredSkills: z.array(z.string()),
	}),
	challengeSpec: z.object({
		title: z.string(),
		readme: z.string(),
		evaluationCriteria: z.array(z.string()),
	}),
});

const guideStepOutputSchema = z.object({
	submissionId: z.string(),
	challengeId: z.string(),
	scorerOutput: submissionScorerOutputSchema,
	guide: z.array(
		z.object({
			question: z.string(),
			expected_answer: z.string(),
			focus_area: z.string().optional(),
		}),
	),
});

const scoreSubmissionStep = createStep({
	id: 'score-submission',
	inputSchema: workflowInputSchema,
	outputSchema: scorerStepOutputSchema,
	execute: async ({ inputData }) => {
		const { submissionId, challengeId, candidateCode } = inputData;

		const [chRow] = await db
			.select()
			.from(challenge)
			.where(eq(challenge.id, challengeId))
			.limit(1);

		if (!chRow?.jobPostId) {
			throw new Error('Challenge or job post not found');
		}

		const content = chRow.challengeContent;
		if (!content?.readme) {
			throw new Error('Challenge content is incomplete');
		}
		const evaluationCriteria = content.evaluationCriteria ?? [];

		const [jp] = await db
			.select()
			.from(jobPost)
			.where(eq(jobPost.id, chRow.jobPostId))
			.limit(1);

		if (!jp) {
			throw new Error('Job post not found');
		}

		const scorerOutput = (await submissionScorerTool.execute!(
			{
				challenge: {
					title: chRow.title,
					readme: content.readme,
					evaluationCriteria,
				},
				candidateCode,
				jobPost: {
					experienceLevel: jp.experienceLevel as
						| 'junior'
						| 'mid'
						| 'senior'
						| 'lead',
					requiredSkills: jp.requiredSkills ?? [],
				},
			},
			{} as never,
		)) as SubmissionScorerOutput;

		return {
			submissionId,
			challengeId,
			scorerOutput,
			jobPost: {
				title: jp.title,
				experienceLevel: jp.experienceLevel as
					| 'junior'
					| 'mid'
					| 'senior'
					| 'lead',
				requiredSkills: jp.requiredSkills ?? [],
			},
			challengeSpec: {
				title: chRow.title,
				readme: content.readme,
				evaluationCriteria,
			},
		};
	},
});

const interviewGuideStep = createStep({
	id: 'generate-interview-guide',
	inputSchema: scorerStepOutputSchema,
	outputSchema: guideStepOutputSchema,
	execute: async ({ inputData }) => {
		const guideResult = (await interviewGuideTool.execute!(
			{
				jobPost: {
					title: inputData.jobPost.title,
					experienceLevel: inputData.jobPost.experienceLevel,
					requiredSkills: inputData.jobPost.requiredSkills,
				},
				challenge: {
					title: inputData.challengeSpec.title,
					readme: inputData.challengeSpec.readme,
				},
				scorer: {
					score: inputData.scorerOutput.score,
					strengths: inputData.scorerOutput.strengths,
					gaps: inputData.scorerOutput.gaps,
					recommendation: inputData.scorerOutput.recommendation,
				},
			},
			{} as never,
		)) as InterviewGuideOutput;

		return {
			submissionId: inputData.submissionId,
			challengeId: inputData.challengeId,
			scorerOutput: inputData.scorerOutput,
			guide: guideResult.guide,
		};
	},
});

const saveResultsStep = createStep({
	id: 'save-results',
	inputSchema: guideStepOutputSchema,
	outputSchema: z.object({ ok: z.literal(true) }),
	execute: async ({ inputData }) => {
		try {
			await db
				.update(candidateSubmission)
				.set({
					status: 'scored',
					score: inputData.scorerOutput.score,
					recommendation: inputData.scorerOutput.recommendation,
					recommendationNote: inputData.scorerOutput.recommendationNote,
					aiReport: {
						strengths: inputData.scorerOutput.strengths,
						gaps: inputData.scorerOutput.gaps,
					},
					interviewGuide: inputData.guide,
					scoredAt: new Date(),
				})
				.where(eq(candidateSubmission.id, inputData.submissionId));
			return { ok: true as const };
		} catch (err) {
			logError('scoreSubmissionWorkflow save-results failed', err);
			try {
				await db
					.update(candidateSubmission)
					.set({ status: 'failed' })
					.where(eq(candidateSubmission.id, inputData.submissionId));
			} catch (inner) {
				logError('scoreSubmissionWorkflow failed status update', inner);
			}
			throw err;
		}
	},
});

export const scoreSubmissionWorkflow = createWorkflow({
	id: 'scoreSubmissionWorkflow',
	inputSchema: workflowInputSchema,
	outputSchema: z.object({ ok: z.literal(true) }),
})
	.then(scoreSubmissionStep)
	.then(interviewGuideStep)
	.then(saveResultsStep)
	.commit();
