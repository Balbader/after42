import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { jobPostExtractorTool } from '../tools/job-post-extractor-tool';

/**
 * Intelligent job post processing agent with smart routing.
 *
 * This agent:
 * 1. Analyzes the complexity of the extracted text
 * 2. Routes to appropriate model (Haiku for simple, Sonnet for complex)
 * 3. Extracts structured job post data
 * 4. Validates and returns the result
 *
 * Model Selection Strategy:
 * - FAST (Haiku): Clean, well-formatted text < 2000 chars
 * - ACCURATE (Sonnet): Complex formatting, long text, or ambiguous content
 */
export const jobPostProcessorAgent = new Agent({
	id: 'job-post-processor',
	name: 'Job Post Processor',

	instructions: `You are an intelligent job posting analyzer and data extractor.

YOUR ROLE:
1. Analyze the provided job posting text to determine its complexity
2. Select the appropriate processing model (fast vs accurate)
3. Extract structured information using the extract-job-post tool
4. Return the structured data

COMPLEXITY ASSESSMENT:
Use FAST (Haiku) model if:
- Text is well-formatted and clearly structured
- Job details are explicit (title, skills, requirements clearly stated)
- Text length < 2000 characters
- Standard job posting format

Use ACCURATE (Sonnet) model if:
- Text is poorly formatted or has complex layout
- Job details are implicit or require interpretation
- Text length > 2000 characters
- Non-standard format (email threads, informal descriptions, etc.)
- Contains multiple languages or technical jargon

PROCESS:
1. Analyze the text complexity
2. Call extract-job-post tool with appropriate modelPreference
3. Return the structured result

IMPORTANT:
- Always use the extract-job-post tool, never extract data manually
- Be conservative: when in doubt, use "accurate" mode
- Prioritize data quality over processing speed`,

	model: 'openai/gpt-5.4-mini',
	tools: { jobPostExtractorTool },
	memory: new Memory(),
});
