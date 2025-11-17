'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface PainPoint {
	icon: string;
	title: string;
	description: string;
	highlight?: string;
}

const painPoints: PainPoint[] = [
	{
		icon: '🔍',
		title: 'Skills Get Lost in the Noise',
		description:
			'Traditional platforms prioritize matchmaking over skills, focusing on profile views and connections instead of actual technical capabilities. Your perfect candidate might be buried under hundreds of generic profiles.',
		highlight: 'matchmaking over skills',
	},
	{
		icon: '⏱️',
		title: 'Endless Screening Cycles',
		description:
			'Weeks wasted reviewing resumes, conducting interviews, and technical assessments—only to discover the candidate lacks the specific skills you need.',
		highlight: 'Weeks wasted',
	},
	{
		icon: '🎯',
		title: 'Mismatched Expectations',
		description:
			'Platforms focus on wrong priorities like &quot;cultural fit&quot; and &quot;soft skills&quot; while ignoring the hard truth: you need engineers who can actually code and solve problems.',
		highlight: 'wrong priorities',
	},
	{
		icon: '📊',
		title: 'No Real Skill Verification',
		description:
			'Resumes and portfolios can be misleading with unverified claims. Without verified technical assessments, you&apos;re hiring based on hope, not evidence.',
		highlight: 'unverified claims',
	},
	{
		icon: '🔄',
		title: 'Generic Matching Algorithms',
		description:
			'AI-powered matching that looks at keywords and job titles, not actual problem-solving ability or coding proficiency. It&apos;s a one-size-fits-all approach that misses the mark.',
		highlight: 'one-size-fits-all',
	},
	{
		icon: '💼',
		title: 'The 42 School Advantage Ignored',
		description:
			'42 graduates have proven their ability to learn, adapt, and build—but traditional platforms don&apos;t recognize this unique value ignored by most hiring systems.',
		highlight: 'unique value ignored',
	},
];

export default function PainPoints() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Section entrance - fade in from bottom as Hero content fades out
			// Start with dark background immediately to prevent white flash
			if (sectionRef.current) {
				// Set initial background to black to prevent white flash
				gsap.set(sectionRef.current, {
					backgroundColor: 'rgb(0, 0, 0)',
				});

				gsap.fromTo(
					sectionRef.current,
					{
						opacity: 0.8,
						y: 50,
					},
					{
						opacity: 1,
						y: 0,
						duration: 1.2,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: sectionRef.current,
							start: 'top 90%',
							end: 'top 60%',
							scrub: 1,
						},
					},
				);
			}

			// Title animation
			if (titleRef.current) {
				gsap.fromTo(
					titleRef.current,
					{
						y: 50,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: titleRef.current,
							start: 'top 80%',
							toggleActions: 'play none none reverse',
						},
					},
				);
			}

			// Subtitle animation
			if (subtitleRef.current) {
				gsap.fromTo(
					subtitleRef.current,
					{
						y: 30,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: subtitleRef.current,
							start: 'top 80%',
							toggleActions: 'play none none reverse',
						},
					},
				);
			}

			// Cards animation with stagger
			if (cardsRef.current) {
				const cards = cardsRef.current.children;
				gsap.fromTo(
					cards,
					{
						y: 60,
						opacity: 0,
						scale: 0.9,
					},
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.8,
						stagger: 0.15,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: cardsRef.current,
							start: 'top 75%',
							toggleActions: 'play none none reverse',
						},
					},
				);

				// Hover animations for cards
				Array.from(cards).forEach((card) => {
					card.addEventListener('mouseenter', () => {
						gsap.to(card, {
							y: -8,
							scale: 1.02,
							duration: 0.3,
							ease: 'power2.out',
						});
					});

					card.addEventListener('mouseleave', () => {
						gsap.to(card, {
							y: 0,
							scale: 1,
							duration: 0.3,
							ease: 'power2.out',
						});
					});
				});
			}

			// Section background animation - smooth transition
			if (sectionRef.current) {
				gsap.to(sectionRef.current, {
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top center',
						end: 'bottom center',
						scrub: 1,
					},
					backgroundColor: 'rgba(0, 0, 0, 0.98)',
					ease: 'power1.inOut',
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative min-h-screen py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
		>
			{/* Top Transition Gradient - smooth connection from Hero */}
			<div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10"></div>

			{/* Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(6,182,212,0.05),transparent_50%)]"></div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16 lg:mb-20">
					<div ref={titleRef} className="mb-6">
						<Badge
							variant="outline"
							className="mb-4 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-sm px-4 py-1.5"
						>
							The Problem
						</Badge>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
							<span className="text-white">
								Finding the right engineer shouldn&apos;t be
							</span>
							<br />
							<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
								this hard
							</span>
						</h2>
					</div>

					<p
						ref={subtitleRef}
						className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
					>
						Most hiring platforms focus on{' '}
						<span className="text-cyan-400 font-medium">
							matchmaking and connections
						</span>
						, not actual skills. You need engineers who can code,
						not just network.
					</p>
				</div>

				{/* Pain Points Grid */}
				<div
					ref={cardsRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
				>
					{painPoints.map((point, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-lg p-6 lg:p-8 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
						>
							{/* Icon */}
							<div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
								{point.icon}
							</div>

							{/* Content */}
							<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
								{point.title}
							</h3>
							<p className="text-gray-300 leading-relaxed text-sm sm:text-base">
								{point.highlight &&
								point.description.includes(point.highlight)
									? point.description
											.split(point.highlight)
											.map((part, i, arr) => (
												<span key={i}>
													{part}
													{i < arr.length - 1 && (
														<span className="text-cyan-400 font-medium">
															{point.highlight}
														</span>
													)}
												</span>
											))
									: point.description}
							</p>

							{/* Hover Effect Gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 pointer-events-none"></div>
						</div>
					))}
				</div>

				{/* Bottom CTA Message */}
				<div className="mt-16 lg:mt-20 text-center">
					<div className="inline-block bg-gradient-to-r from-cyan-400/10 to-cyan-600/10 border border-cyan-400/20 rounded-lg px-6 py-4 backdrop-blur-sm">
						<p className="text-gray-300 text-sm sm:text-base">
							<span className="text-white font-medium">
								There&apos;s a better way.
							</span>{' '}
							Focus on verified skills, not just profiles.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
