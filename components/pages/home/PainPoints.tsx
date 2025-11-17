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
			'Platforms prioritize matchmaking over skills. Your perfect candidate is buried under generic profiles.',
		highlight: 'matchmaking over skills',
	},
	{
		icon: '⏱️',
		title: 'Endless Screening Cycles',
		description:
			'Weeks wasted on interviews and assessments, only to find candidates lack the skills you need.',
		highlight: 'Weeks wasted',
	},
	{
		icon: '🎯',
		title: 'Mismatched Expectations',
		description:
			'Focus on wrong priorities like &quot;cultural fit&quot; instead of coding ability. You need engineers who can solve problems.',
		highlight: 'wrong priorities',
	},
	{
		icon: '📊',
		title: 'No Real Skill Verification',
		description:
			'Resumes can be misleading. Without verified assessments, you&apos;re hiring on hope, not evidence.',
		highlight: 'unverified claims',
	},
	{
		icon: '🔄',
		title: 'Generic Matching Algorithms',
		description:
			'AI matches keywords, not actual coding skills. One-size-fits-all misses the mark.',
		highlight: 'one-size-fits-all',
	},
	{
		icon: '💼',
		title: 'The 42 School Advantage Ignored',
		description:
			'42 graduates prove their ability to learn and build—but platforms don&apos;t recognize this value.',
		highlight: 'unique value ignored',
	},
];

export default function PainPoints() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

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

			// CTA section animation - make it stand out
			if (ctaRef.current) {
				// Entrance animation
				gsap.fromTo(
					ctaRef.current,
					{
						y: 40,
						opacity: 0,
						scale: 0.9,
					},
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.8,
						ease: 'back.out(1.4)',
						scrollTrigger: {
							trigger: ctaRef.current,
							start: 'top 85%',
							toggleActions: 'play none none reverse',
						},
					},
				);

				// Continuous subtle pulse animation
				gsap.to(ctaRef.current, {
					scale: 1.02,
					duration: 2.5,
					ease: 'power1.inOut',
					repeat: -1,
					yoyo: true,
				});

				// Glow animation
				const glowElement = ctaRef.current.querySelector('.cta-glow');
				if (glowElement) {
					gsap.to(glowElement, {
						opacity: 0.6,
						duration: 2,
						ease: 'power1.inOut',
						repeat: -1,
						yoyo: true,
					});
				}
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
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
				>
					{painPoints.map((point, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-lg p-4 lg:p-5 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
						>
							{/* Icon */}
							<div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
								{point.icon}
							</div>

							{/* Content */}
							<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
								{point.title}
							</h3>
							<p className="text-gray-300 leading-snug text-sm">
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
				<div
					ref={ctaRef}
					className="mt-16 lg:mt-20 text-center relative"
				>
					{/* Glow effect */}
					<div className="cta-glow absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-cyan-500/20 to-cyan-600/20 blur-2xl rounded-2xl -z-10"></div>

					<div className="relative inline-block bg-gradient-to-r from-cyan-400/20 via-cyan-500/15 to-cyan-600/20 border-2 border-cyan-400/40 rounded-xl px-8 py-6 sm:px-12 sm:py-8 backdrop-blur-md shadow-2xl shadow-cyan-500/20 hover:border-cyan-400/60 hover:shadow-cyan-500/30 transition-all duration-300 group">
						{/* Animated gradient border */}
						<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>

						<div className="relative z-10">
							<p className="text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed">
								<span className="text-white font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
									There&apos;s a better way.
								</span>
								<br className="hidden sm:block" />
								<span className="sm:ml-2">
									Focus on{' '}
									<span className="text-cyan-400 font-semibold">
										verified skills
									</span>
									, not just profiles.
								</span>
							</p>
						</div>

						{/* Decorative elements */}
						<div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400/50 rounded-full blur-sm animate-pulse"></div>
						<div
							className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-600/50 rounded-full blur-sm animate-pulse"
							style={{ animationDelay: '1s' }}
						></div>
					</div>
				</div>
			</div>
		</section>
	);
}
