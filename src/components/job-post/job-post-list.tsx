'use client';

import { useEffect, useState } from 'react';
import { listJobPosts } from '@/app/actions/job-post';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

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

interface JobPostListProps {
	recruiterId: string;
}

export function JobPostList({ recruiterId }: JobPostListProps) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [posts, setPosts] = useState<JobPostRow[]>([]);

	useEffect(() => {
		if (!recruiterId) return;

		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);
			const result = await listJobPosts(recruiterId);
			if (cancelled) return;
			setLoading(false);
			if (!result.success) {
				setError(result.error?.message ?? 'Failed to load job posts');
				setPosts([]);
				return;
			}
			setPosts(result.data ?? []);
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [recruiterId]);

	if (!recruiterId) {
		return null;
	}

	if (loading) {
		return (
			<div className="w-full max-w-2xl mx-auto p-6 space-y-4">
				<h2 className="text-2xl font-bold">Your Job Posts</h2>
				<div className="flex items-center gap-2 text-muted-foreground">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
					<span className="text-sm">Loading job posts…</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full max-w-2xl mx-auto p-6 space-y-4">
				<h2 className="text-2xl font-bold">Your Job Posts</h2>
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
					{error}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-2xl mx-auto p-6 space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Your Job Posts</h2>
				<p className="text-muted-foreground mt-1">
					Job posts you&apos;ve uploaded. Use them to create challenges for candidates.
				</p>
			</div>

			{posts.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						<p className="text-sm">No job posts yet.</p>
						<p className="text-xs mt-1">Upload a file above to extract your first job post.</p>
					</CardContent>
				</Card>
			) : (
				<ul className="space-y-4">
					{posts.map((post) => (
						<li key={post.id}>
							<Card className="overflow-hidden">
								<CardHeader className="pb-2">
									<div className="flex flex-wrap items-start justify-between gap-2">
										<div className="min-w-0 flex-1">
											<CardTitle className="text-lg truncate">{post.title}</CardTitle>
											<CardDescription className="mt-0.5">{post.company}</CardDescription>
										</div>
										<div className="flex flex-wrap gap-1.5 shrink-0">
											<Badge variant="secondary" className="capitalize">
												{post.type.replace(/-/g, ' ')}
											</Badge>
											<Badge variant="outline" className="capitalize">
												{post.experienceLevel}
											</Badge>
											{post.remote && (
												<Badge variant="outline">Remote</Badge>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-3 pt-0">
									{post.description && (
										<p className="text-sm text-muted-foreground line-clamp-2">
											{post.description}
										</p>
									)}
									{Array.isArray(post.requiredSkills) && post.requiredSkills.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{post.requiredSkills.slice(0, 5).map((skill) => (
												<Badge key={skill} variant="secondary" className="text-xs font-normal">
													{skill}
												</Badge>
											))}
											{post.requiredSkills.length > 5 && (
												<Badge variant="secondary" className="text-xs font-normal">
													+{post.requiredSkills.length - 5} more
												</Badge>
											)}
										</div>
									)}
									<p className="text-xs text-muted-foreground">
										Uploaded {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
									</p>
									{post.processingStatus === 'completed' ? (
										<GenerateChallengeBtn jobPostId={post.id} />
									) : null}
								</CardContent>
							</Card>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
