'use server';

import { extractTextFromFile, FileValidationError, getFileMetadata } from '@/lib/file-extractor';
import { mastra } from '@/mastra';
import { db } from '@/db';
import { jobPost } from '@/db/schemas/job-post';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { JobPostData } from '@/mastra/tools/job-post-extractor-tool';

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
    // 1. Extract and validate inputs
    const file = formData.get('file') as File | null;
    const recruiterId = formData.get('recruiterId') as string | null;

    if (!file) {
      return {
        success: false,
        error: {
          code: 'MISSING_FILE',
          message: 'No file was uploaded',
        },
      };
    }

    if (!recruiterId) {
      return {
        success: false,
        error: {
          code: 'MISSING_RECRUITER_ID',
          message: 'Recruiter ID is required',
        },
      };
    }

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
    const toolResults = result.toolResults as Array<{ result?: unknown }> | undefined;
    if (!toolResults || toolResults.length === 0) {
      throw new Error('Agent did not return any tool results');
    }

    const extractedData = (toolResults[0].result ?? toolResults[0]) as JobPostData;

    console.log('[Job Post Upload] Data structured successfully');

    // 4. Save to database
    const jobPostId = nanoid();

    await db.insert(jobPost).values({
      id: jobPostId,
      recruiterId,

      // Job details from extracted data
      title: extractedData.title,
      company: extractedData.company,
      description: extractedData.description,
      location: extractedData.location,
      remote: extractedData.remote,
      type: extractedData.type,
      experienceLevel: extractedData.experienceLevel,
      requiredSkills: extractedData.requiredSkills,
      niceToHaveSkills: extractedData.niceToHaveSkills,
      responsibilities: extractedData.responsibilities,

      // Salary
      salaryMin: extractedData.salary?.min,
      salaryMax: extractedData.salary?.max,
      salaryCurrency: extractedData.salary?.currency,

      // Metadata
      originalFileName: file.name,
      originalFileType: file.type,
      processingStatus: 'completed',
    });

    console.log('[Job Post Upload] Saved to database:', jobPostId);

    // 5. Return success with job post ID
    return {
      success: true,
      data: {
        jobPostId,
        extractedData,
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
 * Server action to list all job posts for a recruiter
 */
export async function listJobPosts(recruiterId: string) {
  try {
    const results = await db
      .select()
      .from(jobPost)
      .where(eq(jobPost.recruiterId, recruiterId))
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
