# Job Post Components (`src/components/job-post`)

## Overview
Provides the recruiter UI components for uploading, listing, and deleting job posts. `JobPostUploader` handles file selection and submits `FormData` to the `processJobPost` server action, displaying extracted job-post data or error states and refreshing the router on success. `JobPostList` fetches existing job posts via `listJobPosts`, displays metadata and required skills, and composes `GenerateChallengeBtn` (from `@/components/company`), challenge detail links, and `DeleteJobPostBtn` (which gates `deleteJobPost` behind a confirmation `AlertDialog`). `JobPost` is a static placeholder component with no props or state.

## Interface
- `DeleteJobPostBtn({ jobPostId, title, onDeleted })` (`'use client'`, named export): Renders a delete button and controlled confirmation `AlertDialog` invoking `deleteJobPost(jobPostId)`. Accepts `jobPostId: string`, `title: string`, `onDeleted: () => void` `[delete-job-post-btn.tsx:DeleteJobPostBtn]`.
- `JobPostList({ embedded = false, showHeader = true })` (`'use client'`, named export): Fetches and renders recruiter job posts with challenge-generation and deletion controls `[job-post-list.tsx:JobPostList]`.
- `JobPostUploader({ onSuccess, embedded = false })` (`'use client'`, named export): File upload form invoking `processJobPost(formData)`. Accepts optional `onSuccess?: (jobPostId: string, data: JobPostData) => void` (`JobPostData` from `@/mastra/tools/job-post-extractor-tool`) and `embedded?: boolean` `[job-post-uploader.tsx:JobPostUploader]`.
- `JobPost()` (named export, no `'use client'`, no props): Renders static placeholder `<div><h1>Job Post</h1></div>` `[job-post.tsx:JobPost]`.

## Invariants
- `DeleteJobPostBtn` gates deletion behind a controlled `AlertDialog` (`open` initialized to `false`), disables confirmation while `pending` is true, explicitly branches on `result.error.code === 'HAS_CHALLENGES'` when `!result.success` to display `t('deleteBlockedByChallenges')` instead of generic `t('deleteError')`, and invokes `onDeleted()` and `router.refresh()` only on success `[delete-job-post-btn.tsx:DeleteJobPostBtn]`, `[delete-job-post-btn.tsx:handleDelete]`.
- `JobPostList` guards its mount fetch with a `cancelled` flag cleaned up on unmount/re-run, enforces render precedence (loading skeleton → error banner → empty state → list; no pagination), renders `GenerateChallengeBtn` only when `post.processingStatus === 'completed'`, renders the challenge link only when `post.challengeId` is truthy, and caps displayed `requiredSkills` to 5 items (`slice(0, 5)`) plus an overflow badge when length `> 5` `[job-post-list.tsx:JobPostList]`.
- `JobPostUploader` restricts file picker extensions only via HTML `accept='.pdf,.docx,.txt,.md'` (no client-side size/MIME validation or JS drag-and-drop handlers exist; only static drag-drop hint copy is rendered), disables submission when `uploading || !selectedFileName`, aborts with `FILE_ERROR` when no file is present on submit, captures `const form = e.currentTarget` prior to `await` so `form.reset()` remains safe, and clears `selectedFileName` on `UPLOAD_DONE` only when `result.success` is true `[job-post-uploader.tsx:JobPostUploader]`, `[job-post-uploader.tsx:handleUpload]`, `[job-post-uploader.tsx:uploaderReducer]`.
- `DeleteJobPostBtn`, `JobPostList`, and `JobPostUploader` require `next-intl` client provider context (`'jobPost'`, plus `'dashboard.challengesTab'` in `JobPostList`); `DeleteJobPostBtn` and `JobPostUploader` additionally require `@/i18n/navigation` router context (`useRouter`) `[delete-job-post-btn.tsx:DeleteJobPostBtn]`, `[job-post-list.tsx:JobPostList]`, `[job-post-uploader.tsx:JobPostUploader]`.
- `JobPost` has no invariants `[job-post.tsx:JobPost]`.

## Side Effects
- `DeleteJobPostBtn` invokes server action `deleteJobPost(jobPostId)` (`@/app/actions/job-post`) inside `startTransition`, displays `sonner` `toast.error` / `toast.success`, closes the dialog (`setOpen(false)`), and on success invokes `onDeleted()` and i18n `router.refresh()` `[delete-job-post-btn.tsx:handleDelete]`.
- `JobPostList` invokes server action `listJobPosts()` (`@/app/actions/job-post`) inside `useEffect`, updates reducer state on fetch/challenge creation (`SET_CHALLENGE_FOR_POST`) and deletion (`REMOVE_POST`), and renders declarative `@/i18n/navigation` `<Link href={\`/company/challenges/${post.challengeId}\`}>` `[job-post-list.tsx:JobPostList]`, `[job-post-list.tsx:listReducer]`.
- `JobPostUploader` constructs `FormData` with `'file'`, invokes server action `processJobPost(formData)` (`@/app/actions/job-post`), updates uploader reducer state, invokes `onSuccess?.(jobPostId, extractedData)`, calls `form.reset()` and i18n `router.refresh()` on success, and logs unexpected errors via `console.error('[JobPostUploader]', err)` `[job-post-uploader.tsx:handleUpload]`.
- `JobPost` has no side effects `[job-post.tsx:JobPost]`.

## Verification
- Run: `pnpm lint && pnpm build`
