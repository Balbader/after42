import Link from 'next/link';

import { authController } from '@/bff/controllers/auth.controller';
import { User } from '@/bff/models/user.model';
import { JobPostList } from '@/components/job-post/job-post-list';
import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { headers } from 'next/headers';

export default async function DashboardPage() {
	const { user } = await authController.requireSession(await headers());
	const sessionUser = user as User;
	const firstName = sessionUser.name?.split(' ')[0] ?? 'there';
	const role = sessionUser.role;

	const greeting = () => {
		const h = new Date().getHours();
		if (h < 12) return 'Good morning';
		if (h < 18) return 'Good afternoon';
		return 'Good evening';
	};

	return (
		<div className='mx-auto w-full max-w-3xl min-w-0 px-4 pt-8'>
			<h1 className='font-(family-name:--font-fraunces) text-[32px] font-normal text-[#1C1917]'>
				{greeting()}, {firstName}.
			</h1>
			{role === 'recruiter' ? (
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					Upload a job post to generate your first challenge.
				</p>
			) : role === 'candidate' ? (
				<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
					Complete a challenge to showcase your skills.
				</p>
			) : null}

			{role === 'recruiter' ? (
				<>
					<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
						<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
							NEXT STEP
						</p>
						<h2 className='mt-1 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
							Upload a job post
						</h2>
						<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
							PDF, Word, or plain text. We extract the role and build a challenge
							in seconds.
						</p>
						<a
							href='#job-post-uploader'
							className='mt-3 inline-block font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] hover:underline'
						>
							Upload a job post →
						</a>
					</div>
					<section id='job-post-uploader' className='mt-8'>
						<JobPostUploader recruiterId={sessionUser.id} />
						<JobPostList recruiterId={sessionUser.id} />
					</section>
				</>
			) : null}

			{role === 'candidate' ? (
				<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
					<p className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-wide text-[#78716C] uppercase'>
						NEXT STEP
					</p>
					<h2 className='mt-1 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
						Browse available challenges
					</h2>
					<p className='mt-1 font-(family-name:--font-dm-sans) text-[13px] text-[#78716C]'>
						Find a challenge that matches your stack and start proving your
						skills.
					</p>
					<Link
						href='/candidate/challenges'
						className='mt-3 inline-block font-(family-name:--font-dm-sans) text-[13px] font-medium text-[#C2410C] hover:underline'
					>
						Browse challenges →
					</Link>
				</div>
			) : null}
		</div>
	);
}
