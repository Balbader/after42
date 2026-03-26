'use client';

import { useReducer } from 'react';
import { useTranslations } from 'next-intl';

import { processJobPost } from '@/app/actions/job-post';
import type { JobPostData } from '@/mastra/tools/job-post-extractor-tool';

interface JobPostUploaderProps {
	onSuccess?: (jobPostId: string, data: JobPostData) => void;
	/** Omit page title; use inside dashboard cards (DESIGN.md surface). */
	embedded?: boolean;
}

type UploadResult = {
	success: boolean;
	data?: { jobPostId: string; extractedData: JobPostData };
	error?: { code: string; message: string };
};

type UploaderState = {
	uploading: boolean;
	progress: string;
	fileError: string | null;
	selectedFileName: string | null;
	result: UploadResult | null;
};

type UploaderAction =
	| { type: 'FILE_SELECTED'; name: string | null }
	| { type: 'FILE_ERROR'; message: string }
	| { type: 'UPLOAD_START'; progress: string }
	| { type: 'UPLOAD_PROGRESS'; progress: string }
	| { type: 'UPLOAD_DONE'; result: UploadResult; clearFileName?: boolean }
	| { type: 'UPLOAD_FAIL'; message: string };

function uploaderReducer(state: UploaderState, action: UploaderAction): UploaderState {
	switch (action.type) {
		case 'FILE_SELECTED':
			return { ...state, fileError: null, selectedFileName: action.name };
		case 'FILE_ERROR':
			return { ...state, fileError: action.message };
		case 'UPLOAD_START':
			return { ...state, uploading: true, progress: action.progress, result: null, fileError: null };
		case 'UPLOAD_PROGRESS':
			return { ...state, progress: action.progress };
		case 'UPLOAD_DONE':
			return {
				...state,
				uploading: false,
				progress: '',
				result: action.result,
				selectedFileName: action.clearFileName ? null : state.selectedFileName,
			};
		case 'UPLOAD_FAIL':
			return {
				...state,
				uploading: false,
				progress: '',
				result: {
					success: false,
					error: { code: 'UNEXPECTED_ERROR', message: action.message },
				},
			};
	}
}

const initialState: UploaderState = {
	uploading: false,
	progress: '',
	fileError: null,
	selectedFileName: null,
	result: null,
};

export function JobPostUploader({ onSuccess, embedded = false }: JobPostUploaderProps) {
	const t = useTranslations('jobPost');
	const [state, dispatch] = useReducer(uploaderReducer, initialState);
	const { uploading, progress, fileError, selectedFileName, result } = state;

	async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const form = e.currentTarget;
		const fileInput = form.elements.namedItem(
			'file',
		) as HTMLInputElement | null;
		const file = fileInput?.files?.[0];

		if (!file) {
			dispatch({ type: 'FILE_ERROR', message: t('uploaderSelectFirst') });
			return;
		}

		dispatch({ type: 'UPLOAD_START', progress: t('uploaderUploading') });

		const formData = new FormData(form);
		formData.set('file', file);

		try {
			dispatch({ type: 'UPLOAD_PROGRESS', progress: t('uploaderProgressExtract') });

			const result = await processJobPost(formData);

			dispatch({ type: 'UPLOAD_DONE', result, clearFileName: result.success });

			if (result.success) {
				onSuccess?.(result.data.jobPostId, result.data.extractedData);
				e.currentTarget.reset();
			}
		} catch {
			dispatch({ type: 'UPLOAD_FAIL', message: t('uploaderGenericError') });
		}
	}

	const shell = embedded
		? 'w-full space-y-5'
		: 'mx-auto w-full max-w-2xl space-y-6 p-6 md:p-8';

	return (
		<div className={shell}>
			{!embedded ? (
				<div>
					<h2 className='font-(family-name:--font-fraunces) text-[1.5rem] font-medium tracking-[-0.02em] text-[var(--a42-text)]'>
						{t('uploaderPageTitle')}
					</h2>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('uploaderPageLead')}
					</p>
				</div>
			) : null}

			<form onSubmit={handleUpload} className='space-y-4'>
				<div className='space-y-4 rounded-2xl border-2 border-dashed border-[var(--a42-border)] bg-[var(--a42-bg)] p-6 text-center md:p-8'>
					<div className='flex flex-col items-center gap-2'>
						<svg
							className='h-10 w-10 text-[var(--a42-text-faint)]'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							aria-hidden
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
							/>
						</svg>

						<label
							htmlFor='file-upload'
							className='inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--a42-accent)] px-4 py-2 font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-accent)] transition-colors hover:bg-[var(--a42-accent)] hover:text-white'
						>
							<svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
							</svg>
							{t('uploaderButton')}
						</label>
						<span className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
							{t('uploaderDragDrop')}
						</span>
						{selectedFileName ? (
							<p className='font-(family-name:--font-dm-sans) text-[12px] font-medium text-[var(--a42-text)]'>
								{selectedFileName}
							</p>
						) : null}

						<p className='font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
							{t('uploaderHint')}
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
							const file = e.target.files?.[0];
							dispatch({ type: 'FILE_SELECTED', name: file ? file.name : null });
						}}
					/>
				</div>

				{fileError ? (
					<p className='font-(family-name:--font-dm-sans) text-sm text-red-600 dark:text-red-400' role='alert'>
						{fileError}
					</p>
				) : null}

				<button
					type='submit'
					disabled={uploading || !selectedFileName}
					className='w-full rounded-lg bg-[var(--a42-accent)] px-4 py-2.5 font-(family-name:--font-dm-sans) text-[13px] font-medium text-white transition-colors hover:bg-[var(--a42-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50'
				>
					{uploading ? progress || t('uploaderProcessing') : t('uploaderSubmit')}
				</button>
			</form>

			{uploading ? (
				<div className='space-y-2 rounded-xl border border-[var(--a42-border)] bg-[var(--a42-surface)] p-4'>
					<div className='flex items-center gap-2'>
						<div
							className='h-4 w-4 animate-spin rounded-full border-2 border-[var(--a42-accent)] border-t-transparent'
							aria-hidden
						/>
						<span className='font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)]'>
							{progress}
						</span>
					</div>
					<div className='h-1 overflow-hidden rounded-full bg-[var(--a42-surface-2)]'>
						<div className='h-full w-2/3 animate-pulse bg-[var(--a42-accent)]/40' />
					</div>
				</div>
			) : null}

			{result ? (
				<div
					className={
						result.success
							? 'rounded-xl border border-emerald-200/90 bg-[var(--a42-score-high-bg)] p-4'
							: 'rounded-xl border border-red-200/90 bg-red-50 dark:bg-red-950/35 p-4'
					}
				>
					{result.success && result.data ? (
						<div className='space-y-3'>
							<div className='flex items-center gap-2'>
								<svg
									className='h-5 w-5 shrink-0 text-[color:var(--a42-score-high)]'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-hidden
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M5 13l4 4L19 7'
									/>
								</svg>
								<h3 className='font-(family-name:--font-dm-sans) text-sm font-semibold text-emerald-800 dark:text-emerald-200'>
									{t('uploaderSuccessTitle')}
								</h3>
							</div>

							<div className='space-y-2 font-(family-name:--font-dm-sans) text-sm'>
								<div className='grid grid-cols-2 gap-x-3 gap-y-1'>
									<span className='text-[var(--a42-text-muted)]'>{t('resultTitle')}</span>
									<span className='font-medium text-[var(--a42-text)]'>
										{result.data.extractedData.title}
									</span>

									<span className='text-[var(--a42-text-muted)]'>{t('resultCompany')}</span>
									<span className='font-medium text-[var(--a42-text)]'>
										{result.data.extractedData.company}
									</span>

									<span className='text-[var(--a42-text-muted)]'>{t('resultExperience')}</span>
									<span className='font-medium capitalize text-[var(--a42-text)]'>
										{result.data.extractedData.experienceLevel}
									</span>

									<span className='text-[var(--a42-text-muted)]'>{t('resultType')}</span>
									<span className='font-medium capitalize text-[var(--a42-text)]'>
										{result.data.extractedData.type}
									</span>
								</div>

								<div>
									<span className='text-[var(--a42-text-muted)]'>{t('resultSkills')}</span>
									<div className='mt-1 flex flex-wrap gap-1'>
										{result.data.extractedData.requiredSkills.map((skill) => (
											<span
												key={skill}
												className='rounded-full border border-[var(--a42-border)] bg-[var(--a42-surface)] px-2 py-0.5 text-[11px] text-[var(--a42-text-muted)]'
											>
												{skill}
											</span>
										))}
									</div>
								</div>

								<details className='mt-2'>
									<summary className='cursor-pointer text-[var(--a42-text-muted)] hover:text-[var(--a42-text)]'>
										{t('viewFullData')}
									</summary>
									<pre className='mt-2 max-h-64 overflow-auto rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-3 text-[11px] text-[var(--a42-text-muted)]'>
										{JSON.stringify(result.data.extractedData, null, 2)}
									</pre>
								</details>
							</div>
						</div>
					) : (
						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<svg
									className='h-5 w-5 shrink-0 text-red-600 dark:text-red-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									aria-hidden
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
								<h3 className='font-(family-name:--font-dm-sans) text-sm font-semibold text-red-800 dark:text-red-200'>
									{t('uploaderFailTitle')}
								</h3>
							</div>
							<p className='font-(family-name:--font-dm-sans) text-sm text-red-800 dark:text-red-200'>
								{result.error?.message || t('uploaderGenericError')}
							</p>
							{result.error?.code ? (
								<p className='font-(family-name:--font-dm-sans) text-xs text-red-600 dark:text-red-400'>
									{t('uploaderErrorCode', { code: result.error.code })}
								</p>
							) : null}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
}
