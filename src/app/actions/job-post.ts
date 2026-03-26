'use server';

import { extractTextFromFile, FileValidationError, getFileMetadata } from '@/lib/file-extractor';
import { mastra } from '@/mastra';
import { db } from '@/db';
import { jobPost } from '@/db/schemas/job-post';
import { challenge } from '@/db/schemas/challenge';
import { eq, desc, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';
import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import type { JobPostData } from '@/mastra/tools/job-post-extractor-tool';
import { jobPostSchema } from '@/mastra/tools/job-post-extractor-tool';

/**
 * Tries to find JobPostData in agent tool results (Mastra may wrap in .result, .output, etc.)
 */
function extractJobPostFromToolResults(toolResults: unknown[]): JobPostData | null {
	const validTypes = ['full-time', 'part-time', 'contract', 'internship'];
	const validLevels = ['junior', 'mid', 'senior', 'lead'];

	function isJobPostLike(obj: unknown): obj is JobPostData {
		if (!obj || typeof obj !== 'object') return false;
		const o = obj as Record<string, unknown>;
		return (
			typeof o.title === 'string' &&
			o.title.length > 0 &&
			typeof o.company === 'string' &&
			o.company.length > 0 &&
			typeof o.description === 'string' &&
			o.description.length > 0 &&
			validTypes.includes(String(o.type)) &&
			validLevels.includes(String(o.experienceLevel)) &&
			Array.isArray(o.requiredSkills)
		);
	}

	function search(obj: unknown): JobPostData | null {
		if (isJobPostLike(obj)) return obj as JobPostData;
		if (!obj || typeof obj !== 'object') return null;
		const o = obj as Record<string, unknown>;
		// Mastra wraps tool results as { type: 'tool-result', payload: { result?, output?, ... } }
		for (const key of ['result', 'output', 'object', 'data', 'payload']) {
			const candidate = o[key];
			if (isJobPostLike(candidate)) return candidate as JobPostData;
			if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
				const found = search(candidate);
				if (found) return found;
			}
		}
		if (Array.isArray(o)) {
			for (const item of o) {
				const found = search(item);
				if (found) return found;
			}
		}
		return null;
	}

	for (const item of toolResults) {
		const found = search(item);
		if (found) return found;
	}
	return null;
}

/**
 * Result type for job post processing
 */
type ProcessJobPostResult =
	| {
		success: true;
		data: {
			jobPostId: string;
			extractedData: JobPostData;
		};
	}
	| {
		success: false;
		error: {
			code: string;
			message: string;
		};
	};

/**
 * Server action to process uploaded job posting files.
 *
 * Workflow:
 * 1. Validate and extract text from uploaded file
 * 2. Use Mastra agent to intelligently process and structure the data
 * 3. Save structured data to database
 * 4. Return job post ID for challenge generation
 *
 * Security:
 * - File size limits (10MB)
 * - File type whitelist (PDF, DOCX, TXT, MD)
 * - Content sanitization
 * - Error handling without exposing internals
 *
 * @param formData - FormData containing the uploaded file and recruiter ID
 * @returns Result with job post ID or error details
 */
export async function processJobPost(formData: FormData): Promise<ProcessJobPostResult> {
	try {
		// 1. Session + recruiter only — recruiterId from server session (not client)
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		const file = formData.get('file') as File | null;

		if (!file) {
			return {
				success: false,
				error: {
					code: 'MISSING_FILE',
					message: 'No file was uploaded',
				},
			};
		}

		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return {
				success: false,
				error: {
					code: 'FORBIDDEN',
					message: 'Only recruiters can upload job posts.',
				},
			};
		}

		const recruiterId = sessionUser.id;

		// Get file metadata for logging
		const metadata = getFileMetadata(file);
		console.log('[Job Post Upload] Processing file:', metadata);

		// 2. Extract text from file (with validation)
		let extractedText: string;
		try {
			extractedText = await extractTextFromFile(file);
		} catch (error) {
			if (error instanceof FileValidationError) {
				return {
					success: false,
					error: {
						code: error.code,
						message: error.message,
					},
				};
			}
			throw error; // Re-throw unexpected errors
		}

		console.log('[Job Post Upload] Text extracted, length:', extractedText.length);

		// 3. Process with Mastra agent (smart routing to appropriate model)
		const agent = mastra.getAgent('jobPostProcessorAgent');

		const result = await agent.generate(
			`Analyze and extract structured data from this job posting text:\n\n${extractedText}`
		);

		// Extract the structured data from agent response (tool result shape is version-dependent)
		const rawToolResults = (result.toolResults ?? []) as unknown[];
		if (rawToolResults.length === 0) {
			return {
				success: false,
				error: {
					code: 'EXTRACTION_FAILED',
					message:
						'The job post could not be structured. Please ensure the file contains a clear job title, company name, and description.',
				},
			};
		}

		const extractedData = extractJobPostFromToolResults(rawToolResults);
		if (!extractedData) {
			console.warn('[Job Post Upload] Tool result shape unexpected:', JSON.stringify(rawToolResults[0], null, 2).slice(0, 500));
			return {
				success: false,
				error: {
					code: 'EXTRACTION_FAILED',
					message:
						'The job post could not be structured from the file. Try a different file or format.',
				},
			};
		}

		const parsed = jobPostSchema.safeParse(extractedData);
		if (!parsed.success) {
			console.warn('[Job Post Upload] Validation failed:', parsed.error.flatten());
			return {
				success: false,
				error: {
					code: 'EXTRACTION_FAILED',
					message:
						'Extracted data was incomplete or invalid. Please ensure the file contains job title, company, description, and requirements.',
				},
			};
		}

		const data = parsed.data;
		console.log('[Job Post Upload] Data structured successfully');

		// 4. Save to database
		const jobPostId = nanoid();

		await db.insert(jobPost).values({
			id: jobPostId,
			recruiterId,

			// Job details from extracted data
			title: data.title,
			company: data.company,
			description: data.description,
			location: data.location ?? null,
			remote: data.remote ?? false,
			type: data.type,
			experienceLevel: data.experienceLevel,
			requiredSkills: data.requiredSkills,
			niceToHaveSkills: data.niceToHaveSkills ?? [],
			responsibilities: data.responsibilities ?? [],

			// Salary
			salaryMin: data.salary?.min ?? null,
			salaryMax: data.salary?.max ?? null,
			salaryCurrency: data.salary?.currency ?? null,

			// Metadata
			originalFileName: file.name,
			originalFileType: file.type,
			processingStatus: 'completed',
		});

		console.log('[Job Post Upload] Saved to database:', jobPostId);

		// 5. Return success with job post ID (ensure payload is JSON-serializable for server action response)
		const serializableData: JobPostData = {
			title: data.title,
			company: data.company,
			description: data.description,
			location: data.location,
			remote: data.remote ?? false,
			type: data.type,
			experienceLevel: data.experienceLevel,
			requiredSkills: data.requiredSkills,
			niceToHaveSkills: data.niceToHaveSkills ?? [],
			responsibilities: data.responsibilities ?? [],
			salary: data.salary,
		};

		return {
			success: true,
			data: {
				jobPostId,
				extractedData: serializableData,
			},
		};
	} catch (error) {
		// Log error for debugging (in production, use proper logging service)
		console.error('[Job Post Upload] Error:', error);

		// Return generic error to client (don't expose internals)
		return {
			success: false,
			error: {
				code: 'PROCESSING_FAILED',
				message: 'Failed to process job posting. Please try again or contact support.',
			},
		};
	}
}

/**
 * Server action to retrieve a processed job post by ID
 */
export async function getJobPost(jobPostId: string) {
	try {
		const rows = await db
			.select()
			.from(jobPost)
			.where(eq(jobPost.id, jobPostId))
			.limit(1);
		const result = rows[0] ?? null;

		if (!result) {
			return {
				success: false,
				error: {
					code: 'NOT_FOUND',
					message: 'Job post not found',
				},
			};
		}

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error('[Get Job Post] Error:', error);
		return {
			success: false,
			error: {
				code: 'FETCH_FAILED',
				message: 'Failed to retrieve job post',
			},
		};
	}
}

/**
 * Server action to list job posts for the current session user (recruiters only).
 */
export async function listJobPosts() {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return {
				success: false,
				error: {
					code: 'FORBIDDEN',
					message: 'Only recruiters can list job posts.',
				},
			};
		}

		const results = await db
			.select()
			.from(jobPost)
			.where(eq(jobPost.recruiterId, sessionUser.id))
			.orderBy(desc(jobPost.createdAt));

		return {
			success: true,
			data: results,
		};
	} catch (error) {
		console.error('[List Job Posts] Error:', error);
		return {
			success: false,
			error: {
				code: 'FETCH_FAILED',
				message: 'Failed to retrieve job posts',
			},
		};
	}
}

/**
 * Deletes a job post owned by the current recruiter.
 * Blocked when any challenge still references this job post.
 */
export async function deleteJobPost(jobPostId: string) {
	try {
		const { user } = await authController.requireSession(await headers());
		const sessionUser = user as User | null;
		if (!sessionUser || sessionUser.role !== 'recruiter') {
			return {
				success: false as const,
				error: {
					code: 'FORBIDDEN',
					message: 'Only recruiters can delete job posts.',
				},
			};
		}

		const [post] = await db
			.select()
			.from(jobPost)
			.where(eq(jobPost.id, jobPostId))
			.limit(1);

		if (!post) {
			return {
				success: false as const,
				error: {
					code: 'NOT_FOUND',
					message: 'Job post not found.',
				},
			};
		}

		if (post.recruiterId !== sessionUser.id) {
			return {
				success: false as const,
				error: {
					code: 'FORBIDDEN',
					message: 'You can only delete your own job posts.',
				},
			};
		}

		const [linked] = await db
			.select({ n: count() })
			.from(challenge)
			.where(eq(challenge.jobPostId, jobPostId));

		if ((linked?.n ?? 0) > 0) {
			return {
				success: false as const,
				error: {
					code: 'HAS_CHALLENGES',
					message:
						'This job post is linked to one or more challenges. Remove or unlink those challenges first.',
				},
			};
		}

		await db.delete(jobPost).where(eq(jobPost.id, jobPostId));

		return { success: true as const };
	} catch (error) {
		console.error('[Delete Job Post] Error:', error);
		return {
			success: false as const,
			error: {
				code: 'DELETE_FAILED',
				message: 'Failed to delete job post.',
			},
		};
	}
}
