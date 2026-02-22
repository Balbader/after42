'use client';

import { useState } from 'react';
import { processJobPost } from '@/app/actions/job-post';
import type { JobPostData } from '@/mastra/tools/job-post-extractor-tool';

interface JobPostUploaderProps {
  recruiterId: string;
  onSuccess?: (jobPostId: string, data: JobPostData) => void;
}

export function JobPostUploader({
  recruiterId,
  onSuccess,
}: JobPostUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    data?: { jobPostId: string; extractedData: JobPostData };
    error?: { code: string; message: string };
  } | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFileError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem(
      'file',
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setFileError('Please select a file first.');
      return;
    }

    setUploading(true);
    setProgress('Uploading file...');
    setResult(null);

    const formData = new FormData(form);
    formData.set('file', file);
    formData.append('recruiterId', recruiterId);

    try {
      setProgress('Extracting text from file...');

      const result = await processJobPost(formData);

      setResult(result);
      setUploading(false);
      setProgress('');

      if (result.success) {
        onSuccess?.(result.data.jobPostId, result.data.extractedData);

        // Reset form
        e.currentTarget.reset();
      }
    } catch (error) {
      setUploading(false);
      setProgress('');
      setResult({
        success: false,
        error: {
          code: 'UNEXPECTED_ERROR',
          message: 'An unexpected error occurred. Please try again.',
        },
      });
    }
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-6 space-y-6'>
      <div>
        <h2 className='text-2xl font-bold'>Upload Job Posting</h2>
        <p className='text-muted-foreground mt-1'>
          Upload a job post file (PDF, Word, or text) to extract structured data
          for challenge generation
        </p>
      </div>

      <form onSubmit={handleUpload} className='space-y-4'>
        <div className='border-2 border-dashed rounded-lg p-8 text-center space-y-4'>
          <div className='flex flex-col items-center gap-2'>
            <svg
              className='w-12 h-12 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>

            <div>
              <label
                htmlFor='file-upload'
                className='cursor-pointer text-primary hover:text-primary/80 font-medium'
              >
                Choose a file
              </label>
              <span className='text-muted-foreground'> or drag and drop</span>
            </div>

            <p className='text-xs text-muted-foreground'>
              PDF, DOCX, TXT, or MD up to 10MB
            </p>
          </div>

          <input
            id='file-upload'
            type='file'
            name='file'
            accept='.pdf,.docx,.txt,.md'
            disabled={uploading}
            className='hidden'
            aria-invalid={!!fileError}
            onChange={(e) => {
              setFileError(null);
              const file = e.target.files?.[0];
              if (file) {
                // Show selected file name
                const label = document.querySelector(
                  'label[for="file-upload"]',
                );
                if (label) {
                  label.textContent = file.name;
                }
              }
            }}
          />
        </div>

        {fileError && (
          <p className='text-sm text-destructive' role='alert'>
            {fileError}
          </p>
        )}

        <button
          type='submit'
          disabled={uploading}
          className='w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {uploading ? progress || 'Processing...' : 'Upload and Process'}
        </button>
      </form>

      {/* Progress indicator */}
      {uploading && (
        <div className='bg-muted rounded-lg p-4 space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent' />
            <span className='text-sm font-medium'>{progress}</span>
          </div>
          <div className='h-1 bg-background rounded-full overflow-hidden'>
            <div className='h-full bg-primary animate-pulse w-2/3' />
          </div>
        </div>
      )}

      {/* Result display */}
      {result && (
        <div
          className={`rounded-lg p-4 border ${
            result.success
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}
        >
          {result.success && result.data ? (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <h3 className='font-semibold text-green-900 dark:text-green-100'>
                  Job Post Processed Successfully!
                </h3>
              </div>

              <div className='space-y-2 text-sm'>
                <div className='grid grid-cols-2 gap-2'>
                  <span className='text-muted-foreground'>Title:</span>
                  <span className='font-medium'>
                    {result.data.extractedData.title}
                  </span>

                  <span className='text-muted-foreground'>Company:</span>
                  <span className='font-medium'>
                    {result.data.extractedData.company}
                  </span>

                  <span className='text-muted-foreground'>
                    Experience Level:
                  </span>
                  <span className='font-medium capitalize'>
                    {result.data.extractedData.experienceLevel}
                  </span>

                  <span className='text-muted-foreground'>Type:</span>
                  <span className='font-medium capitalize'>
                    {result.data.extractedData.type}
                  </span>
                </div>

                <div>
                  <span className='text-muted-foreground'>
                    Required Skills:
                  </span>
                  <div className='flex flex-wrap gap-1 mt-1'>
                    {result.data.extractedData.requiredSkills.map(
                      (skill, i) => (
                        <span
                          key={i}
                          className='bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs'
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <details className='mt-2'>
                  <summary className='cursor-pointer text-muted-foreground hover:text-foreground'>
                    View full extracted data
                  </summary>
                  <pre className='mt-2 p-3 bg-background rounded text-xs overflow-auto max-h-64'>
                    {JSON.stringify(result.data.extractedData, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
                <h3 className='font-semibold text-red-900 dark:text-red-100'>
                  Processing Failed
                </h3>
              </div>
              <p className='text-sm text-red-800 dark:text-red-200'>
                {result.error?.message || 'An error occurred'}
              </p>
              {result.error?.code && (
                <p className='text-xs text-red-600 dark:text-red-400'>
                  Error code: {result.error.code}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
