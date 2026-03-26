'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { processJobPost } from '@/app/actions/job-post';
import type { JobPostData } from '@/mastra/tools/job-post-extractor-tool';

interface JobPostUploaderProps {
	onSuccess?: (jobPostId: string, data: JobPostData) => void;
}

export function JobPostUploader({ onSuccess }: JobPostUploaderProps) {
	const t = useTranslations('jobPost');
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState<string>('');
	const [fileError, setFileError] = useState<string | null>(null);
	const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
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
			setFileError(t('uploaderSelectFirst'));
			return;
		}

		setUploading(true);
		setProgress(t('uploaderUploading'));
		setResult(null);

		const formData = new FormData(form);
		formData.set('file', file);

		try {
			setProgress(t('uploaderProgressExtract'));

			const result = await processJobPost(formData);

			setResult(result);
			setUploading(false);
			setProgress('');

			if (result.success) {
				onSuccess?.(result.data.jobPostId, result.data.extractedData);
				e.currentTarget.reset();
				setSelectedFileName(null);
			}
		} catch {
			setUploading(false);
			setProgress('');
			setResult({
				success: false,
				error: {
					code: 'UNEXPECTED_ERROR',
					message: t('uploaderGenericError'),
				},
			});
		}
	}

	return (
		<div className='mx-auto w-full max-w-2xl space-y-6 p-6'>
			<div>
				<h2 className='text-2xl font-bold'>{t('uploaderPageTitle')}</h2>
				<p className='text-muted-foreground mt-1'>{t('uploaderPageLead')}</p>
			</div>

			<form onSubmit={handleUpload} className='space-y-4'>
				<div className='space-y-4 rounded-lg border-2 border-dashed p-8 text-center'>
					<div className='flex flex-col items-center gap-2'>
						<svg
							className='h-12 w-12 text-muted-foreground'
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
								className='cursor-pointer font-medium text-primary hover:text-primary/80'
							>
								{selectedFileName ?? t('uploaderButton')}
							</label>
							<span className='text-muted-foreground'>
								{' '}
								{t('uploaderDragDrop')}
							</span>
						</div>

						<p className='text-xs text-muted-foreground'>{t('uploaderHint')}</p>
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
							setSelectedFileName(file ? file.name : null);
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
					className='w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{uploading ? progress || t('uploaderProcessing') : t('uploaderSubmit')}
				</button>
			</form>

			{uploading && (
				<div className='space-y-2 rounded-lg bg-muted p-4'>
					<div className='flex items-center gap-2'>
						<div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
						<span className='text-sm font-medium'>{progress}</span>
					</div>
					<div className='h-1 overflow-hidden rounded-full bg-background'>
						<div className='h-full w-2/3 animate-pulse bg-primary' />
					</div>
				</div>
			)}

			{result && (
				<div
					className={`rounded-lg border p-4 ${result.success
							? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
							: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
						}`}
				>
					{result.success && result.data ? (
						<div className='space-y-3'>
							<div className='flex items-center gap-2'>
								<svg
									className='h-5 w-5 text-green-600 dark:text-green-400'
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
									{t('uploaderSuccessTitle')}
								</h3>
							</div>

							<div className='space-y-2 text-sm'>
								<div className='grid grid-cols-2 gap-2'>
									<span className='text-muted-foreground'>
										{t('resultTitle')}
									</span>
									<span className='font-medium'>
										{result.data.extractedData.title}
									</span>

									<span className='text-muted-foreground'>
										{t('resultCompany')}
									</span>
									<span className='font-medium'>
										{result.data.extractedData.company}
									</span>

									<span className='text-muted-foreground'>
										{t('resultExperience')}
									</span>
									<span className='font-medium capitalize'>
										{result.data.extractedData.experienceLevel}
									</span>

									<span className='text-muted-foreground'>
										{t('resultType')}
									</span>
									<span className='font-medium capitalize'>
										{result.data.extractedData.type}
									</span>
								</div>

								<div>
									<span className='text-muted-foreground'>
										{t('resultSkills')}
									</span>
									<div className='mt-1 flex flex-wrap gap-1'>
										{result.data.extractedData.requiredSkills.map((skill) => (
											<span
												key={skill}
												className='rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary'
											>
												{skill}
											</span>
										))}
									</div>
								</div>

								<details className='mt-2'>
									<summary className='cursor-pointer text-muted-foreground hover:text-foreground'>
										{t('viewFullData')}
									</summary>
									<pre className='mt-2 max-h-64 overflow-auto rounded bg-background p-3 text-xs'>
										{JSON.stringify(result.data.extractedData, null, 2)}
									</pre>
								</details>
							</div>
						</div>
					) : (
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<svg
									className='h-5 w-5 text-red-600 dark:text-red-400'
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
									{t('uploaderFailTitle')}
								</h3>
							</div>
							<p className='text-sm text-red-800 dark:text-red-200'>
								{result.error?.message || t('uploaderGenericError')}
							</p>
							{result.error?.code && (
								<p className='text-xs text-red-600 dark:text-red-400'>
									{t('uploaderErrorCode', { code: result.error.code })}
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
