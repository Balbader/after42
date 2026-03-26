'use client';

import { useEffect, useReducer, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';

import { listJobPosts } from '@/app/actions/job-post';
import { GenerateChallengeBtn } from '@/components/company';

type JobPostRow = {
	id: string;
	recruiterId: string;
	title: string;
	company: string;
	description: string;
	location: string | null;
	remote: boolean | null;
	type: string;
	experienceLevel: string;
	requiredSkills: string[];
	niceToHaveSkills: string[] | null;
	responsibilities: string[] | null;
	salaryMin: number | null;
	salaryMax: number | null;
	salaryCurrency: string | null;
	originalFileName: string;
	originalFileType: string;
	processingStatus: string;
	createdAt: Date;
	updatedAt: Date;
};

type ListState = {
	loading: boolean;
	error: string | null;
	posts: JobPostRow[];
};

type ListAction =
	| { type: 'FETCH_START' }
	| { type: 'FETCH_SUCCESS'; posts: JobPostRow[] }
	| { type: 'FETCH_ERROR'; error: string };

function listReducer(state: ListState, action: ListAction): ListState {
	switch (action.type) {
		case 'FETCH_START':
			return { loading: true, error: null, posts: [] };
		case 'FETCH_SUCCESS':
			return { loading: false, error: null, posts: action.posts };
		case 'FETCH_ERROR':
			return { loading: false, error: action.error, posts: [] };
	}
}

function SkillTag({ children }: { children: ReactNode }) {
	return (
		<span className='rounded-full bg-[var(--a42-surface-2)] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-muted)]'>
			{children}
		</span>
	);
}

type JobPostListProps = {
	/** Flatten padding / width when nested in dashboard cards. */
	embedded?: boolean;
	/** Show list title + description (off when section heading is outside). */
	showHeader?: boolean;
};

export function JobPostList({ embedded = false, showHeader = true }: JobPostListProps) {
	const t = useTranslations('jobPost');
	const [state, dispatch] = useReducer(listReducer, {
		loading: true,
		error: null,
		posts: [],
	});
	const { loading, error, posts } = state;

	useEffect(() => {
		let cancelled = false;

		async function load() {
			dispatch({ type: 'FETCH_START' });
			const result = await listJobPosts();
			if (cancelled) return;
			if (!result.success) {
				dispatch({ type: 'FETCH_ERROR', error: result.error?.message ?? t('listError') });
				return;
			}
			dispatch({ type: 'FETCH_SUCCESS', posts: result.data ?? [] });
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [t]);

	const wrap = embedded ? 'w-full space-y-4' : 'mx-auto w-full max-w-2xl space-y-6 p-6';

	if (loading) {
		return (
			<div className={wrap}>
				{showHeader ? (
					<>
						<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[var(--a42-text)]'>
							{t('listTitle')}
						</h2>
						<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
							{t('listLoading')}
						</p>
					</>
				) : (
					<p className='font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('listLoading')}
					</p>
				)}
				<div className='space-y-3'>
					<div className='h-14 w-full animate-pulse rounded-xl bg-[var(--a42-surface-2)]' />
					<div className='h-14 w-full animate-pulse rounded-xl bg-[var(--a42-surface-2)]' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={wrap}>
				{showHeader ? (
					<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[var(--a42-text)]'>
						{t('listTitle')}
					</h2>
				) : null}
				<div className='rounded-xl border border-red-200/90 bg-red-50 dark:bg-red-950/35 p-4 font-(family-name:--font-dm-sans) text-sm text-red-800 dark:text-red-200'>
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className={wrap}>
			{showHeader ? (
				<div>
					<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[var(--a42-text)]'>
						{t('listTitle')}
					</h2>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
						{t('listDescription')}
					</p>
				</div>
			) : null}

			{posts.length === 0 ? (
				<div className='rounded-xl border border-dashed border-[var(--a42-border)] bg-[var(--a42-bg)] px-6 py-10 text-center'>
					<p className='font-(family-name:--font-fraunces) text-base italic text-[var(--a42-text-muted)]'>
						{t('listEmptyAlt')}
					</p>
				</div>
			) : (
				<ul className='divide-y divide-[var(--a42-border)] overflow-hidden rounded-xl border border-[var(--a42-border)] bg-[var(--a42-surface)]'>
					{posts.map((post) => (
						<li
							key={post.id}
							className='px-4 py-4 transition-colors hover:bg-[var(--a42-surface-2)] md:px-5'
						>
							<div className='flex flex-wrap items-start justify-between gap-2'>
								<div className='min-w-0 flex-1'>
									<p className='truncate font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)]'>
										{post.title}
									</p>
									<p className='mt-1 flex flex-wrap items-center gap-2 font-(family-name:--font-dm-sans) text-xs text-[var(--a42-text-muted)]'>
										<span>{post.company}</span>
										<span className='text-[var(--a42-border-strong)]'>·</span>
										<span className='capitalize'>
											{post.type.replace(/-/g, ' ')}
										</span>
										<span className='text-[var(--a42-border-strong)]'>·</span>
										<span className='capitalize'>{post.experienceLevel}</span>
										{post.remote ? (
											<>
												<span className='text-[var(--a42-border-strong)]'>·</span>
												<span>{t('remote')}</span>
											</>
										) : null}
									</p>
								</div>
							</div>
							{post.description ? (
								<p className='mt-2 line-clamp-2 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
									{post.description}
								</p>
							) : null}
							{Array.isArray(post.requiredSkills) &&
							post.requiredSkills.length > 0 ? (
								<div className='mt-2 flex flex-wrap gap-1'>
									{post.requiredSkills.slice(0, 5).map((skill) => (
										<SkillTag key={skill}>{skill}</SkillTag>
									))}
									{post.requiredSkills.length > 5 ? (
										<SkillTag>
											{t('moreSkills', {
												count: post.requiredSkills.length - 5,
											})}
										</SkillTag>
									) : null}
								</div>
							) : null}
							<p className='mt-2 font-(family-name:--font-dm-sans) text-[11px] text-[var(--a42-text-faint)]'>
								{t('uploadedPrefix')}{' '}
								{formatDistanceToNow(new Date(post.createdAt), {
									addSuffix: true,
								})}
							</p>
							{post.processingStatus === 'completed' ? (
								<div className='mt-3'>
									<GenerateChallengeBtn
										jobPostId={post.id}
										variant={embedded ? 'inline' : 'redirect'}
									/>
								</div>
							) : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
