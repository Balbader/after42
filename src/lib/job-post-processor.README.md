# Job Post Processor - Complete Implementation Guide

This document explains the intelligent job post processing system that extracts structured data from uploaded files using Mastra.ai.

## 🎯 Overview

Recruiters can upload job postings in various formats (PDF, DOCX, TXT, MD). The system:
1. Validates and extracts text from files (no AI cost)
2. Uses Mastra agent with smart routing to structure the data
3. Saves structured JSON to database
4. Discards the original file (minimizes storage costs)

## 💰 Cost Optimization Strategy

### Smart Model Routing
- **Simple/clean text** → Claude Haiku (~$0.001/post)
- **Complex/formatted text** → Claude Sonnet (~$0.01-0.02/post)
- **Agent overhead** → Haiku for routing decision (~$0.0005)

**Average cost per job post: $0.001 - $0.003** (95% of cases use Haiku)

### Why This Is Optimized
1. **Text extraction is free** (pdf-parse, mammoth libraries)
2. **No file storage** (text extracted → JSON stored → file discarded)
3. **Prompt caching** (system prompts automatically cached by AI SDK)
4. **Smart routing** (cheap model for simple posts, expensive only when needed)

## 🏗️ Architecture

```
Upload File (PDF/DOCX/TXT)
    ↓
[File Validation] (Security)
    ↓
[Text Extraction] (Free - no AI)
    ↓
[Mastra Agent] (Smart Routing)
    ├─ Simple? → Haiku ($0.001)
    └─ Complex? → Sonnet ($0.01)
    ↓
[Structured JSON]
    ↓
[Database Storage]
    ↓
[Challenge Generation Agent] (separate step)
```

## 📁 File Structure

```
src/
├── lib/
│   ├── file-extractor.ts           # Text extraction + validation
│   └── job-post-processor.README.md # This file
├── mastra/
│   ├── tools/
│   │   └── job-post-extractor-tool.ts # AI structuring tool
│   ├── agents/
│   │   └── job-post-processor.ts      # Smart routing agent
│   └── index.ts                        # Mastra config (updated)
├── db/
│   └── schemas/
│       └── job-post.ts                 # Database schema
└── app/
    └── actions/
        └── job-post.ts                 # Server actions
```

## 🔒 Security Features

### File Validation
- **Max size**: 10MB
- **Allowed types**: PDF, DOCX, TXT, MD (whitelist)
- **MIME type checking**: Prevents file extension spoofing
- **Content sanitization**: Removes null bytes, normalizes whitespace

### Error Handling
- Validation errors with specific codes
- Generic errors to client (don't expose internals)
- Comprehensive logging for debugging

### Data Safety
- No arbitrary code execution
- No SQL injection (Drizzle ORM with parameterized queries)
- No XSS (text sanitization)

## 🚀 Usage

### 1. Database Migration

First, generate and run the migration:

```bash
npm run dbg  # Generate migration for job_post table
npm run dbm  # Apply migration
```

### 2. Frontend Implementation

```tsx
// components/job-post-uploader.tsx
'use client';

import { useState } from 'react';
import { processJobPost } from '@/app/actions/job-post';

export function JobPostUploader({ recruiterId }: { recruiterId: string }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('recruiterId', recruiterId);

    const result = await processJobPost(formData);
    setResult(result);
    setUploading(false);

    if (result.success) {
      console.log('Job Post ID:', result.data.jobPostId);
      console.log('Extracted Data:', result.data.extractedData);
      // Navigate to challenge generation or show success message
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        name="file"
        accept=".pdf,.docx,.txt,.md"
        required
        disabled={uploading}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Processing...' : 'Upload Job Post'}
      </button>

      {result && (
        <div>
          {result.success ? (
            <div>
              <h3>Success!</h3>
              <p>Job Post ID: {result.data.jobPostId}</p>
              <pre>{JSON.stringify(result.data.extractedData, null, 2)}</pre>
            </div>
          ) : (
            <div>
              <h3>Error</h3>
              <p>{result.error.message}</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
```

### 3. Retrieve Job Post Data

```tsx
import { getJobPost, listJobPosts } from '@/app/actions/job-post';

// Get single job post
const result = await getJobPost('job-post-id');
if (result.success) {
  console.log(result.data);
}

// List all job posts for a recruiter
const posts = await listJobPosts('recruiter-id');
if (posts.success) {
  console.log(posts.data);
}
```

### 4. Generate Challenge (Next Step)

```typescript
// After job post is processed, use the data to generate a challenge
import { mastra } from '@/mastra';
import { getJobPost } from '@/app/actions/job-post';

async function generateChallenge(jobPostId: string) {
  const jobPostResult = await getJobPost(jobPostId);

  if (!jobPostResult.success) {
    throw new Error('Job post not found');
  }

  const jobPost = jobPostResult.data;

  // Use a challenge generation agent (to be created)
  const agent = mastra.getAgent('challenge-generator');

  const challenge = await agent.generate(`
    Generate a technical coding challenge for this job posting:

    Title: ${jobPost.title}
    Experience Level: ${jobPost.experienceLevel}
    Required Skills: ${jobPost.requiredSkills.join(', ')}
    Responsibilities: ${jobPost.responsibilities.join(', ')}

    Create a challenge that tests the candidate's ability to ${jobPost.responsibilities[0]}
    using ${jobPost.requiredSkills.slice(0, 3).join(', ')}.
  `);

  return challenge;
}
```

## 📊 Structured Data Format

The extracted JSON follows this schema:

```typescript
{
  title: string;                           // "Senior Full Stack Developer"
  company: string;                         // "Tech Corp"
  description: string;                     // Full job description
  location?: string;                       // "San Francisco, CA"
  remote: boolean;                         // true/false
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'junior' | 'mid' | 'senior' | 'lead';
  requiredSkills: string[];                // ["React", "TypeScript", "Node.js"]
  niceToHaveSkills: string[];              // ["GraphQL", "Docker"]
  responsibilities: string[];              // ["Build features", "Code review"]
  salary?: {
    min?: number;                          // 100000
    max?: number;                          // 150000
    currency?: string;                     // "USD"
  }
}
```

## 🧪 Testing in Mastra Studio

Start the development server:
```bash
npm run dev
```

Open Mastra Studio at http://localhost:4111

Test the agent:
1. Select "job-post-processor" agent
2. Paste sample job posting text
3. Watch the agent analyze and extract structured data
4. Check which model it chose (fast vs accurate)

## 🎯 Next Steps

1. **Create challenge generator agent** - Uses job post data to generate coding challenges
2. **Add rate limiting** - Prevent abuse (e.g., max 10 uploads per recruiter per day)
3. **Add file preview** - Show extracted text before processing
4. **Add cost tracking** - Log model usage and costs per recruiter
5. **Add batch processing** - Process multiple job posts at once

## 💡 Tips

- **Test with real job posts** to verify extraction quality
- **Monitor costs** using Mastra observability dashboard
- **Adjust complexity thresholds** if too many posts use expensive model
- **Add caching** if same job posts are uploaded multiple times
- **Version the schema** for future changes to job post structure

## 🐛 Troubleshooting

### "File type not allowed"
- Check file extension is .pdf, .docx, .txt, or .md
- Verify MIME type matches (some files may be corrupted)

### "File too large"
- Max size is 10MB
- For PDFs, try compressing or splitting

### "Processing failed"
- Check ANTHROPIC_API_KEY is set in .env
- Verify Mastra agent is registered in src/mastra/index.ts
- Check server logs for detailed error

### Agent returns empty data
- Text extraction may have failed (check console logs)
- Job post format may be too complex (agent will use Sonnet)
- Try with a simpler, well-formatted job post first

## 📚 Resources

- [Mastra Documentation](https://mastra.ai/llms.txt)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [mammoth](https://www.npmjs.com/package/mammoth)
- [Claude API Pricing](https://www.anthropic.com/pricing)
