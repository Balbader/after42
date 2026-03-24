import Link from 'next/link';

export default function Home() {
	return (
		<main className='flex flex-col bg-[#FAFAF8]'>
			{/* Hero */}
			<section
				className='border-b border-[#E7E5E4] bg-[#FFFFFF] px-4 pt-20 pb-20 sm:px-6 lg:px-8'
				aria-labelledby='hero-heading'
			>
				<div className='container mx-auto max-w-4xl text-center'>
					<p className='mb-4 font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.08em] text-[#78716C] uppercase'>
						BLIND TECHNICAL HIRING
					</p>
					<h1
						id='hero-heading'
						className='font-(family-name:--font-fraunces) text-[40px] leading-tight font-normal tracking-[-0.03em] text-[#1C1917] sm:text-[56px]'
					>
						Skills, not CVs.
					</h1>
					<p className='mx-auto mt-4 max-w-xl font-(family-name:--font-dm-sans) text-lg leading-relaxed font-normal text-[#78716C]'>
						The hiring marketplace built exclusively for 42 students. Prove what
						you can do with custom technical challenges — and let companies hire
						on proof, not paperwork.
					</p>
					<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
						<Link
							href='/sign-up'
							className='inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412]'
						>
							Join as a developer
						</Link>
						<Link
							href='/sign-in'
							className='inline-flex items-center justify-center rounded-md border border-[#E7E5E4] bg-transparent px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-[#1C1917] transition-colors hover:border-[#D6D3D1]'
						>
							I&apos;m hiring →
						</Link>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section
				className='border-b border-[#E7E5E4] px-4 py-16 sm:px-6 lg:px-8'
				aria-labelledby='how-heading'
			>
				<div className='container mx-auto max-w-5xl'>
					<h2
						id='how-heading'
						className='text-center font-(family-name:--font-fraunces) text-[32px] font-normal text-[#1C1917]'
					>
						Three steps.
					</h2>
					<div className='mt-12 flex flex-col divide-y divide-[#E7E5E4] border-y border-[#E7E5E4] md:flex-row md:divide-x md:divide-y-0'>
						<div className='flex flex-1 flex-col px-4 py-8 md:px-8'>
							<span className='font-(family-name:--font-fraunces) text-[48px] font-light text-[#E7E5E4]'>
								1
							</span>
							<h3 className='mt-2 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
								Company uploads a job post
							</h3>
							<p className='mt-2 max-w-xs font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#78716C]'>
								PDF, Word, or plain text. AI extracts the role, stack, and
								requirements.
							</p>
						</div>
						<div className='flex flex-1 flex-col px-4 py-8 md:px-8'>
							<span className='font-(family-name:--font-fraunces) text-[48px] font-light text-[#E7E5E4]'>
								2
							</span>
							<h3 className='mt-2 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
								AI builds the challenge
							</h3>
							<p className='mt-2 max-w-xs font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#78716C]'>
								A custom take-home challenge, tailored to the role. Ready in
								seconds.
							</p>
						</div>
						<div className='flex flex-1 flex-col px-4 py-8 md:px-8'>
							<span className='font-(family-name:--font-fraunces) text-[48px] font-light text-[#E7E5E4]'>
								3
							</span>
							<h3 className='mt-2 font-(family-name:--font-dm-sans) text-base font-medium text-[#1C1917]'>
								Candidate proves their skill
							</h3>
							<p className='mt-2 max-w-xs font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#78716C]'>
								Code is reviewed blind. The company receives a score and
								interview guide — not a CV.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* For both sides */}
			<section
				className='border-b border-[#E7E5E4] px-4 py-16 sm:px-6 lg:px-8'
				aria-labelledby='both-heading'
			>
				<div className='container mx-auto max-w-5xl'>
					<h2
						id='both-heading'
						className='text-center font-(family-name:--font-fraunces) text-[32px] font-normal text-[#1C1917]'
					>
						Built for both sides.
					</h2>
					<div className='mt-12 grid gap-0 md:grid-cols-2 md:divide-x md:divide-[#E7E5E4]'>
						<div className='px-4 py-6 md:px-10'>
							<h3 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917]'>
								For companies
							</h3>
							<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#78716C]'>
								Evaluate 42 school talent on real work, not pedigree. AI scoring
								+ interview guide included.
							</p>
						</div>
						<div className='border-t border-[#E7E5E4] px-4 py-6 md:border-t-0 md:px-10'>
							<h3 className='font-(family-name:--font-dm-sans) text-base font-semibold text-[#1C1917]'>
								For developers
							</h3>
							<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[#78716C]'>
								A fair way to prove yourself, regardless of background. Your code
								is the application.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Vision */}
			<section
				className='bg-[#FAFAF8] px-4 py-16 sm:px-6 lg:px-8'
				aria-labelledby='vision-heading'
			>
				<div className='container mx-auto max-w-2xl text-center'>
					<p
						id='vision-heading'
						className='font-(family-name:--font-fraunces) text-[28px] leading-relaxed font-normal italic text-[#1C1917]'
					>
						Fair hiring means judging people on what they can build — not where they
						studied.
					</p>
					<p className='mt-6 font-(family-name:--font-dm-sans) text-[13px] text-[#A8A29E]'>
						The after42 thesis
					</p>
				</div>
			</section>

			{/* CTA */}
			<section
				className='bg-[#1C1917] px-4 py-20 sm:px-6 lg:px-8'
				aria-labelledby='cta-heading'
			>
				<div className='container mx-auto max-w-2xl text-center'>
					<h2
						id='cta-heading'
						className='font-(family-name:--font-fraunces) text-[36px] font-normal text-[#FAFAF8]'
					>
						Ready to put skills first?
					</h2>
					<p className='mt-2 font-(family-name:--font-dm-sans) text-base text-[#A8A29E]'>
						Prove what you can build — or hire on proof, not paperwork.
					</p>
					<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
						<Link
							href='/sign-up'
							className='inline-flex items-center justify-center rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412]'
						>
							Join as a developer
						</Link>
						<Link
							href='/sign-in'
							className='inline-flex items-center justify-center rounded-md border border-[#44403C] bg-transparent px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-[#FAFAF8] transition-colors hover:border-[#78716C]'
						>
							I&apos;m hiring →
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
