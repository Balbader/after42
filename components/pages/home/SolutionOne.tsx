'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface Solution {
	icon: string;
	title: string;
	description: string;
	highlight?: string;
}

const solutions: Solution[] = [
	{
		icon: '🎯',
		title: 'Skills-First Discovery',
		description:
			'We prioritize verified coding skills over generic profiles. Find candidates who can actually code, not just network.',
		highlight: 'verified coding skills',
	},
	{
		icon: '✅',
		title: 'Real Skill Verification',
		description:
			'Every candidate is assessed through practical coding challenges. No more hiring on hope, see actual proof of ability.',
		highlight: 'practical coding challenges',
	},
	{
		icon: '⚡',
		title: 'Streamlined Hiring Process',
		description:
			'Skip the endless screening cycles. Our AI-powered matching connects you with pre-verified candidates who fit your needs.',
		highlight: 'pre-verified candidates',
	},
	{
		icon: '🧠',
		title: '42 School Recognition',
		description:
			'We understand the unique value of 42 graduates, proven ability to learn, adapt, and build. Your perfect match is here.',
		highlight: 'unique value of 42 graduates',
	},
	{
		icon: '🔬',
		title: 'Intelligent Skill Matching',
		description:
			'Our algorithms match based on actual coding capabilities, not just keywords. Find engineers who solve problems, not just talk about them.',
		highlight: 'actual coding capabilities',
	},
	{
		icon: '📈',
		title: 'Focus on What Matters',
		description:
			'We cut through the noise and focus on coding ability. No more mismatched expectations, just engineers who deliver.',
		highlight: 'coding ability',
	},
];

export default function SolutionOne() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Section entrance - fade in from bottom
			if (sectionRef.current) {
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

			// Section background animation
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

			// CTA section animation
			if (ctaRef.current) {
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
			{/* Top Transition Gradient */}
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
							The Solution
						</Badge>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
							<span className="text-white">
								How{' '}
								<span className="text-cyan-400 font-bold">After-42</span>{' '}
								solves
							</span>
							<br />
							<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
								the problem
							</span>
						</h2>
					</div>

					<p
						ref={subtitleRef}
						className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
					>
						We&apos;ve built a platform that puts{' '}
						<span className="text-cyan-400 font-medium">
							verified skills first
						</span>
						. No more guesswork—just engineers who can code and
						deliver.
					</p>
				</div>

				{/* Solutions Grid */}
				<div
					ref={cardsRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
				>
					{solutions.map((solution, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-lg p-4 lg:p-5 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
						>
							{/* Icon */}
							<div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
								{solution.icon}
							</div>

							{/* Content */}
							<h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
								{solution.title}
							</h3>
							<p className="text-gray-300 leading-snug text-sm">
								{solution.highlight &&
								solution.description.includes(
									solution.highlight,
								)
									? solution.description
											.split(solution.highlight)
											.map((part, i, arr) => (
												<span key={i}>
													{part}
													{i < arr.length - 1 && (
														<span className="text-cyan-400 font-medium">
															{solution.highlight}
														</span>
													)}
												</span>
											))
									: solution.description}
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
									Ready to find your next engineer?
								</span>
								<br className="hidden sm:block" />
								<span className="sm:ml-2">
									Join after-42 and{' '}
									<span className="text-cyan-400 font-semibold">
										hire with confidence
									</span>
									.
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
