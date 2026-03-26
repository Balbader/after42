'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Wand2, GitBranch, Building2, UserRound, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const steps = [
	{
		n: '01',
		title: 'Company uploads a job post',
		body: 'PDF, Word, or plain text. AI extracts the role, stack, and requirements.',
		icon: Upload,
	},
	{
		n: '02',
		title: 'AI builds the challenge',
		body: 'A custom take-home challenge, tailored to the role. Ready in seconds.',
		icon: Wand2,
	},
	{
		n: '03',
		title: 'Candidate proves their skill',
		body: 'Code is reviewed blind. The company receives a score and interview guide — not a CV.',
		icon: GitBranch,
	},
] as const;

export default function HomePage() {
	const rootRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const el = rootRef.current;
		if (!el) return;

		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduced) return;

		const ctx = gsap.context(() => {
			gsap.from('.home-hero-anim', {
				opacity: 0,
				y: 28,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.11,
				delay: 0.05,
			});

			gsap.from('.home-hero-preview', {
				opacity: 0,
				x: 36,
				duration: 0.85,
				ease: 'power3.out',
				delay: 0.25,
			});

			gsap.to('.home-hero-preview-inner', {
				y: -5,
				duration: 2.8,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
			});

			gsap.utils.toArray<HTMLElement>('.home-reveal-block').forEach((block) => {
				gsap.from(block, {
					opacity: 0,
					y: 32,
					duration: 0.65,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: block,
						start: 'top 90%',
						once: true,
					},
				});
			});

			gsap.from('.home-reveal-stagger .home-reveal-item', {
				opacity: 0,
				y: 26,
				duration: 0.55,
				stagger: 0.12,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.home-reveal-stagger',
					start: 'top 88%',
					once: true,
				},
			});

			gsap.from('.home-cta-inner', {
				opacity: 0,
				y: 24,
				duration: 0.7,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.home-cta-section',
					start: 'top 85%',
					once: true,
				},
			});
		}, el);

		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<main
			ref={rootRef}
			className='min-h-screen bg-[var(--a42-bg)] text-[var(--a42-text)]'
		>
			{/* Hero */}
			<section
				className='relative overflow-hidden border-b border-[var(--a42-border)] bg-[var(--a42-surface)]'
				aria-labelledby='hero-heading'
			>
				<div
					className='pointer-events-none absolute inset-0 opacity-[0.45]'
					aria-hidden
				>
					<div className='absolute -top-24 right-0 h-[min(520px,70vw)] w-[min(520px,90vw)] rounded-full bg-[var(--a42-accent-light)] blur-3xl' />
					<div className='absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-[var(--a42-surface-2)] blur-3xl' />
				</div>

				<div className='relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 xl:py-28'>
					<div className='grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:gap-16'>
						<div className='max-w-2xl'>
							<p
								className={cn(
									'home-hero-anim font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.08em] text-[var(--a42-text-muted)] uppercase',
								)}
							>
								Blind technical hiring
							</p>
							<h1
								id='hero-heading'
								className={cn(
									'home-hero-anim mt-4 font-(family-name:--font-fraunces) text-[2.5rem] leading-[1.08] font-normal tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]',
								)}
							>
								Skills, not CVs.
							</h1>
							<p
								className={cn(
									'home-hero-anim mt-5 font-(family-name:--font-dm-sans) text-base leading-relaxed text-[var(--a42-text-muted)] sm:text-lg',
								)}
							>
								The hiring marketplace built exclusively for 42 students. Prove
								what you can do with custom technical challenges — and let
								companies hire on proof, not paperwork.
							</p>
							<div className='home-hero-anim mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
								<Button
									asChild
									size='lg'
									className='h-11 rounded-md bg-[var(--a42-accent)] px-6 font-(family-name:--font-dm-sans) text-sm font-medium text-white shadow-none hover:bg-[var(--a42-accent-hover)]'
								>
									<Link href='/sign-up'>Join as a developer</Link>
								</Button>
								<Button
									asChild
									variant='outline'
									size='lg'
									className='h-11 rounded-md border-[var(--a42-border)] bg-transparent font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-text)] shadow-none hover:border-[var(--a42-border-strong)] hover:bg-[var(--a42-surface-2)]'
								>
									<Link href='/sign-in' className='inline-flex items-center gap-2'>
										I&apos;m hiring
										<ArrowRight className='size-4' aria-hidden />
									</Link>
								</Button>
							</div>
						</div>

						<div className='home-hero-preview relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none'>
							<div className='home-hero-preview-inner'>
								<div
									className='rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-5 shadow-[0_24px_48px_-12px_rgba(28,25,23,0.12)] sm:p-6'
									aria-hidden
								>
								<div className='flex items-center justify-between gap-3 border-b border-[var(--a42-border)] pb-4'>
									<span className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[var(--a42-text-faint)] uppercase'>
										Blind review
									</span>
									<span className='rounded-full bg-[var(--a42-surface-2)] px-2.5 py-0.5 font-(family-name:--font-mono) text-[10px] font-medium text-[var(--a42-text-muted)]'>
										Live
									</span>
								</div>
								<div className='pt-5'>
									<p className='font-(family-name:--font-dm-sans) text-[13px] font-medium text-[var(--a42-text)]'>
										Candidate #3
									</p>
									<div className='mt-4 flex flex-wrap items-end gap-3'>
										<span className='font-(family-name:--font-fraunces) text-4xl font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-5xl'>
											91
										</span>
										<span className='pb-1 font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)]'>
											/ 100
										</span>
										<span
											className='mb-1 inline-flex items-center rounded-full border border-[var(--a42-score-high)] bg-[var(--a42-score-high-bg)] px-3 py-1 font-(family-name:--font-dm-sans) text-xs font-medium text-[var(--a42-score-high)]'
										>
											Recommend
										</span>
									</div>
									<p className='mt-5 font-(family-name:--font-dm-sans) text-xs leading-relaxed text-[var(--a42-text-muted)]'>
										Identity stays hidden until the interview. Recruiters see
										scores and an AI interview guide — not a name or CV.
									</p>
								</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section
				className='border-b border-[var(--a42-border)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
				aria-labelledby='how-heading'
			>
				<div className='mx-auto max-w-[1200px]'>
					<div className='home-reveal-block'>
						<h2
							id='how-heading'
							className='font-(family-name:--font-fraunces) text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-[2rem]'
						>
							Three steps.
						</h2>
						<p className='mt-3 max-w-xl font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-base'>
							From job post to scored submission — a straight line. No extra
							tools for recruiters or candidates.
						</p>
					</div>

					<div className='home-reveal-stagger mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3'>
						{steps.map(({ n, title, body, icon: Icon }) => (
							<article
								key={n}
								className='home-reveal-item group rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-6 transition-colors duration-150 hover:border-[var(--a42-border-strong)] hover:bg-[var(--a42-surface-2)] sm:p-8'
							>
								<div className='flex items-start justify-between gap-4'>
									<span className='font-(family-name:--font-fraunces) text-3xl font-light tabular-nums text-[var(--a42-border-strong)] transition-colors group-hover:text-[var(--a42-text-faint)]'>
										{n}
									</span>
									<span className='flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-bg)] text-[var(--a42-accent)]'>
										<Icon className='size-5' strokeWidth={1.75} aria-hidden />
									</span>
								</div>
								<h3 className='mt-6 font-(family-name:--font-dm-sans) text-base font-medium text-[var(--a42-text)]'>
									{title}
								</h3>
								<p className='mt-2 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)]'>
									{body}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* For both sides */}
			<section
				className='border-b border-[var(--a42-border)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
				aria-labelledby='both-heading'
			>
				<div className='mx-auto max-w-[1200px]'>
					<div className='home-reveal-block'>
						<h2
							id='both-heading'
							className='font-(family-name:--font-fraunces) text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--a42-text)] sm:text-[2rem]'
						>
							Built for both sides.
						</h2>
						<p className='mt-3 max-w-xl font-(family-name:--font-dm-sans) text-sm text-[var(--a42-text-muted)] sm:text-base'>
							One platform: credible screens for companies, fair proof for
							developers.
						</p>
					</div>

					<div className='mt-12 grid gap-4 md:grid-cols-2 md:gap-5'>
						<article className='home-reveal-block rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-8 sm:p-10'>
							<div className='flex size-11 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-accent-light)] text-[var(--a42-accent)]'>
								<Building2 className='size-5' strokeWidth={1.75} aria-hidden />
							</div>
							<h3 className='mt-6 font-(family-name:--font-dm-sans) text-lg font-semibold text-[var(--a42-text)]'>
								For companies
							</h3>
							<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-[15px]'>
								Evaluate 42 school talent on real work, not pedigree. AI scoring
								and an interview guide are included — so HR can run a credible
								technical screen without pulling engineers off the roadmap.
							</p>
						</article>
						<article className='home-reveal-block rounded-lg border border-[var(--a42-border)] bg-[var(--a42-surface)] p-8 sm:p-10'>
							<div className='flex size-11 items-center justify-center rounded-md border border-[var(--a42-border)] bg-[var(--a42-surface-2)] text-[var(--a42-text)]'>
								<UserRound className='size-5' strokeWidth={1.75} aria-hidden />
							</div>
							<h3 className='mt-6 font-(family-name:--font-dm-sans) text-lg font-semibold text-[var(--a42-text)]'>
								For developers
							</h3>
							<p className='mt-3 font-(family-name:--font-dm-sans) text-sm leading-relaxed text-[var(--a42-text-muted)] sm:text-[15px]'>
								A fair way to prove yourself, regardless of background. Your code
								is the application — reviewed blind until you choose to move
								forward.
							</p>
						</article>
					</div>
				</div>
			</section>

			{/* Vision */}
			<section
				className='px-4 py-16 sm:px-6 sm:py-20 lg:px-8'
				aria-labelledby='vision-heading'
			>
				<div className='mx-auto max-w-[1200px]'>
					<div className='home-reveal-block mx-auto max-w-3xl border-l-2 border-[var(--a42-accent)] bg-[var(--a42-surface)] py-8 pl-6 pr-6 sm:py-10 sm:pl-10 sm:pr-10 lg:pl-12'>
						<p
							id='vision-heading'
							className='font-(family-name:--font-fraunces) text-xl leading-snug font-normal italic text-[var(--a42-text)] sm:text-2xl lg:text-[1.75rem] lg:leading-relaxed'
						>
							Fair hiring means judging people on what they can build — not where
							they studied.
						</p>
						<p className='mt-6 font-(family-name:--font-dm-sans) text-[12px] font-medium tracking-[0.04em] text-[var(--a42-text-faint)] uppercase'>
							The after42 thesis
						</p>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				className='home-cta-section border-t border-[var(--a42-border-strong)] bg-[var(--a42-text)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8'
				aria-labelledby='cta-heading'
			>
				<div className='home-cta-inner mx-auto max-w-[1200px] text-center'>
					<h2
						id='cta-heading'
						className='font-(family-name:--font-fraunces) text-[2rem] font-normal tracking-[-0.02em] text-[var(--a42-bg)] sm:text-4xl'
					>
						Ready to put skills first?
					</h2>
					<p className='mx-auto mt-4 max-w-lg font-(family-name:--font-dm-sans) text-base text-[var(--a42-text-faint)]'>
						Prove what you can build — or hire on proof, not paperwork.
					</p>
					<div className='mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
						<Button
							asChild
							size='lg'
							className='h-11 rounded-md bg-[var(--a42-accent)] px-6 font-(family-name:--font-dm-sans) text-sm font-medium text-white shadow-none hover:bg-[var(--a42-accent-hover)]'
						>
							<Link href='/sign-up'>Join as a developer</Link>
						</Button>
						<Button
							asChild
							variant='outline'
							size='lg'
							className='h-11 rounded-md border-[#44403C] bg-transparent font-(family-name:--font-dm-sans) text-sm font-medium text-[var(--a42-bg)] shadow-none hover:border-[#78716C] hover:bg-white/5'
						>
							<Link href='/sign-in' className='inline-flex items-center gap-2'>
								I&apos;m hiring
								<ArrowRight className='size-4' aria-hidden />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
