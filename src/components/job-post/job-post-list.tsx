'use client';

import { useEffect, useState, type ReactNode } from 'react';
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

function SkillTag({ children }: { children: ReactNode }) {
	return (
		<span className='rounded-full bg-[#F5F4F1] px-2 py-0.5 font-(family-name:--font-dm-sans) text-[11px] text-[#78716C]'>
			{children}
		</span>
	);
}

export function JobPostList() {
	const t = useTranslations('jobPost');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [posts, setPosts] = useState<JobPostRow[]>([]);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			const result = await listJobPosts();
			if (cancelled) return;
			setLoading(false);
			if (!result.success) {
				setError(result.error?.message ?? t('listError'));
				setPosts([]);
				return;
			}
			setPosts(result.data ?? []);
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [t]);

	if (loading) {
		return (
			<div className='mx-auto w-full max-w-2xl space-y-4 p-6'>
				<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917]'>
					{t('listTitle')}
				</h2>
				<p className='font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					{t('listLoading')}
				</p>
				<div className='space-y-3'>
					<div className='h-4 w-full max-w-md animate-pulse rounded bg-[#F5F4F1]' />
					<div className='h-4 w-full max-w-sm animate-pulse rounded bg-[#F5F4F1]' />
					<div className='h-4 w-full max-w-lg animate-pulse rounded bg-[#F5F4F1]' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='mx-auto w-full max-w-2xl space-y-4 p-6'>
				<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917]'>
					{t('listTitle')}
				</h2>
				<div className='rounded-lg border border-[#E7E5E4] bg-[#FEF2F2] p-4 font-(family-name:--font-dm-sans) text-sm text-[#DC2626]'>
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className='mx-auto w-full max-w-2xl space-y-6 p-6'>
			<div>
				<h2 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917]'>
					{t('listTitle')}
				</h2>
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					{t('listDescription')}
				</p>
			</div>

			{posts.length === 0 ? (
				<div className='py-12 text-center font-(family-name:--font-fraunces) text-base italic text-[#A8A29E]'>
					{t('listEmptyAlt')}
				</div>
			) : (
				<ul className='divide-y divide-[#E7E5E4] border-y border-[#E7E5E4]'>
					{posts.map((post) => (
						<li
							key={post.id}
							className='py-4 transition-colors hover:bg-[#F5F4F1]'
						>
							<div className='flex flex-wrap items-start justify-between gap-2'>
								<div className='min-w-0 flex-1'>
									<p className='truncate font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917]'>
										{post.title}
									</p>
									<p className='mt-1 flex flex-wrap items-center gap-2 font-(family-name:--font-dm-sans) text-xs text-[#78716C]'>
										<span>{post.company}</span>
										<span className='text-[#D6D3D1]'>·</span>
										<span className='capitalize'>
											{post.type.replace(/-/g, ' ')}
										</span>
										<span className='text-[#D6D3D1]'>·</span>
										<span className='capitalize'>{post.experienceLevel}</span>
										{post.remote ? (
											<>
												<span className='text-[#D6D3D1]'>·</span>
												<span>{t('remote')}</span>
											</>
										) : null}
									</p>
								</div>
							</div>
							{post.description ? (
								<p className='mt-2 line-clamp-2 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
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
							<p className='mt-2 font-(family-name:--font-dm-sans) text-[11px] text-[#A8A29E]'>
								{t('uploadedPrefix')}{' '}
								{formatDistanceToNow(new Date(post.createdAt), {
									addSuffix: true,
								})}
							</p>
							{post.processingStatus === 'completed' ? (
								<div className='mt-3'>
									<GenerateChallengeBtn jobPostId={post.id} />
								</div>
							) : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
