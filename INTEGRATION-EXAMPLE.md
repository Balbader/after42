# Job Post to Challenge Generation - Integration Example

This document shows how to integrate the job post processor with a challenge generation system.

## Complete Workflow

```
1. Recruiter uploads job post file (PDF/DOCX/TXT)
   ↓
2. System extracts and structures data → Database
   ↓
3. Recruiter reviews extracted data (optional)
   ↓
4. Recruiter clicks "Generate Challenge"
   ↓
5. Challenge Generator Agent creates coding challenge
   ↓
6. Challenge saved to database
   ↓
7. Recruiter reviews/edits challenge
```

## Step 1: Job Post Upload Page

```tsx
// app/(logged-in)/recruiter/job-posts/new/page.tsx
import { JobPostUploader } from '@/components/job-post-uploader';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewJobPostPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'recruiter') {
    redirect('/sign-in');
  }

  return (
    <div className="container py-8">
      <JobPostUploader
        recruiterId={session.user.id}
        onSuccess={(jobPostId) => {
          // Navigate to review page
          window.location.href = `/recruiter/job-posts/${jobPostId}`;
        }}
      />
    </div>
  );
}
```

## Step 2: Job Post Review Page

```tsx
// app/(logged-in)/recruiter/job-posts/[id]/page.tsx
import { getJobPost } from '@/app/actions/job-post';
import { ChallengeGeneratorButton } from '@/components/challenge-generator-button';
import { notFound } from 'next/navigation';

export default async function JobPostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getJobPost(params.id);

  if (!result.success) {
    notFound();
  }

  const jobPost = result.data;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{jobPost.title}</h1>
          <p className="text-xl text-muted-foreground mt-1">{jobPost.company}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Experience Level</span>
            <p className="font-medium capitalize">{jobPost.experienceLevel}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Job Type</span>
            <p className="font-medium capitalize">{jobPost.type}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Location</span>
            <p className="font-medium">
              {jobPost.location || 'Not specified'} {jobPost.remote && '(Remote)'}
            </p>
          </div>
          {jobPost.salaryMin && jobPost.salaryMax && (
            <div>
              <span className="text-sm text-muted-foreground">Salary Range</span>
              <p className="font-medium">
                {jobPost.salaryCurrency} {jobPost.salaryMin.toLocaleString()} -{' '}
                {jobPost.salaryMax.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {jobPost.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {jobPost.niceToHaveSkills.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Nice to Have Skills</h3>
            <div className="flex flex-wrap gap-2">
              {jobPost.niceToHaveSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {jobPost.responsibilities.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Key Responsibilities</h3>
            <ul className="list-disc list-inside space-y-1">
              {jobPost.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Full Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {jobPost.description}
          </p>
        </div>

        <div className="pt-6 border-t">
          <ChallengeGeneratorButton jobPostId={jobPost.id} />
        </div>
      </div>
    </div>
  );
}
```

## Step 3: Challenge Generator Button (Client Component)

```tsx
// components/challenge-generator-button.tsx
'use client';

import { useState } from 'react';
import { generateChallenge } from '@/app/actions/challenge';

export function ChallengeGeneratorButton({ jobPostId }: { jobPostId: string }) {
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);

    const result = await generateChallenge(jobPostId);

    if (result.success) {
      // Navigate to challenge editor
      window.location.href = `/recruiter/challenges/${result.data.challengeId}`;
    } else {
      alert('Failed to generate challenge: ' + result.error.message);
    }

    setGenerating(false);
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={generating}
      className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
    >
      {generating ? 'Generating Challenge...' : 'Generate Tech Challenge'}
    </button>
  );
}
```

## Step 4: Challenge Generator Agent (To Be Created)

```typescript
// src/mastra/agents/challenge-generator.ts
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';

export const challengeGeneratorAgent = new Agent({
  id: 'challenge-generator',
  name: 'Challenge Generator',

  instructions: `You are an expert technical interviewer and coding challenge designer.

YOUR ROLE:
Generate realistic, practical coding challenges based on job posting requirements.

CHALLENGE REQUIREMENTS:
1. Align with the job's required skills and experience level
2. Test real-world scenarios from the job responsibilities
3. Include clear success criteria
4. Provide reasonable time estimates (30min - 4hrs based on level)
5. Include test cases and evaluation rubric

DIFFICULTY LEVELS:
- Junior: Straightforward implementation, basic concepts
- Mid: Multiple components, moderate complexity, design decisions
- Senior: System design, optimization, scalability considerations
- Lead: Architecture, trade-offs, mentorship scenarios

OUTPUT FORMAT:
Return a structured challenge with:
- Title (engaging and relevant)
- Description (clear context and requirements)
- Technical requirements (languages, frameworks allowed)
- Success criteria (what "done" looks like)
- Test cases (example inputs/outputs)
- Evaluation rubric (scoring criteria)
- Estimated time
- Difficulty level`,

  model: 'anthropic/claude-sonnet-4-5', // Use Sonnet for quality challenges
  tools: {}, // Add tools if needed (e.g., code analysis, test generation)
  memory: new Memory(),
});
```

## Step 5: Challenge Generation Server Action

```typescript
// src/app/actions/challenge.ts
'use server';

import { mastra } from '@/mastra';
import { db } from '@/db';
import { challenge } from '@/db/schemas/challenge';
import { getJobPost } from './job-post';
import { nanoid } from 'nanoid';

export async function generateChallenge(jobPostId: string) {
  try {
    // 1. Get job post data
    const jobPostResult = await getJobPost(jobPostId);
    if (!jobPostResult.success) {
      return {
        success: false,
        error: {
          code: 'JOB_POST_NOT_FOUND',
          message: 'Job post not found',
        },
      };
    }

    const jobPost = jobPostResult.data;

    // 2. Generate challenge using Mastra agent
    const agent = mastra.getAgent('challenge-generator');

    const prompt = `Generate a technical coding challenge for this job posting:

Title: ${jobPost.title}
Company: ${jobPost.company}
Experience Level: ${jobPost.experienceLevel}
Job Type: ${jobPost.type}

Required Skills: ${jobPost.requiredSkills.join(', ')}
Nice to Have: ${jobPost.niceToHaveSkills.join(', ')}

Key Responsibilities:
${jobPost.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Description:
${jobPost.description}

Create a challenge that:
1. Tests the candidate's ability to perform the first 1-2 responsibilities
2. Requires knowledge of the top 3 required skills
3. Matches the ${jobPost.experienceLevel} experience level
4. Takes 1-3 hours to complete

Focus on practical, real-world scenarios that this developer would face on the job.`;

    const result = await agent.generate(prompt);

    // 3. Parse the generated challenge
    // (You'll need to define how to extract structured data from the agent response)
    const challengeData = {
      title: 'Generated Challenge Title', // Extract from result
      seniority_level: jobPost.experienceLevel,
      tech_stack: jobPost.requiredSkills.join(', '),
      location_country: jobPost.location?.split(',')[1]?.trim() || 'Remote',
      location_city: jobPost.location?.split(',')[0]?.trim() || 'Remote',
      remote: jobPost.remote,
      job_type: jobPost.type,
      salary_range_min: jobPost.salaryMin || 0,
      salary_range_max: jobPost.salaryMax || 0,
      currency: jobPost.salaryCurrency || 'USD',
      equity: false,
      description: result.text, // Full challenge description
    };

    // 4. Save to database
    const challengeId = nanoid();
    await db.insert(challenge).values({
      id: challengeId,
      ...challengeData,
    });

    return {
      success: true,
      data: {
        challengeId,
        challenge: challengeData,
      },
    };
  } catch (error) {
    console.error('[Generate Challenge] Error:', error);
    return {
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: 'Failed to generate challenge',
      },
    };
  }
}
```

## Step 6: Register Challenge Generator in Mastra

```typescript
// src/mastra/index.ts (add to agents)
import { challengeGeneratorAgent } from './agents/challenge-generator';

export const mastra = new Mastra({
  // ... other config
  agents: {
    weatherAgent,
    jobPostProcessorAgent,
    challengeGeneratorAgent, // Add this
  },
  // ... other config
});
```

## Cost Analysis

### Per Job Post Processing
- Text extraction: **$0 (free)**
- Smart routing (Haiku): **~$0.0005**
- Structuring (Haiku 95% / Sonnet 5%): **~$0.001 - $0.002**
- **Total: ~$0.001 - $0.003 per job post**

### Per Challenge Generation
- Challenge generation (Sonnet for quality): **~$0.02 - $0.05**
- Total cost per hire flow: **~$0.03 - $0.06**

### Cost Savings vs Alternatives
- **File storage avoided**: ~$0.05/month per job post × 1000 posts = $50/month
- **Manual data entry avoided**: ~5 minutes × $30/hr = $2.50 per post
- **High-quality challenges**: Comparable to hiring interview designer

## Next Steps

1. **Implement challenge generator agent** following the example above
2. **Add challenge editor** for recruiters to review/modify
3. **Add challenge library** to reuse challenges across similar job posts
4. **Add analytics** to track which challenges correlate with good hires
5. **Add A/B testing** for different challenge formats

## Security Considerations

- **Authentication**: Verify recruiter owns the job post before generating
- **Rate limiting**: Limit challenge generations per recruiter (e.g., 50/day)
- **Content moderation**: Review generated challenges for appropriateness
- **Data privacy**: Don't include sensitive company info in challenges
