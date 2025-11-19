'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface Product {
	icon: string;
	title: string;
	description: string;
	category: string;
}

const products: Product[] = [
	{
		icon: '🤖',
		title: 'AI Challenge Generator',
		description:
			'Transform job posts into tailored coding challenges that test the exact skills you need.',
		category: 'Hiring',
	},
	{
		icon: '✅',
		title: 'Skill Verification',
		description:
			'Every candidate is assessed through practical coding challenges. See actual proof of ability.',
		category: 'Assessment',
	},
	{
		icon: '🎯',
		title: 'Intelligent Matching',
		description:
			'Our algorithms match based on actual coding capabilities, not just keywords.',
		category: 'Matching',
	},
	{
		icon: '📊',
		title: 'Developer Profiles',
		description:
			'Get detailed profiles with verified skills, challenge results, and coding history. Every profile is backed by evidence.',
		category: 'Profiles',
	},
	{
		icon: '⚡',
		title: 'Streamlined Process',
		description:
			'Skip endless screening cycles. Connect with pre-verified candidates who fit your needs. No more wasted interviews.',
		category: 'Efficiency',
	},
	{
		icon: '🏫',
		title: '42 School Focus',
		description:
			'We understand the unique value of 42 graduates: proven ability to learn, adapt, and build.',
		category: 'Specialization',
	},
];

export default function ModularSolutions() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const productsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Section entrance
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

			// Products animation with stagger
			if (productsRef.current) {
				const productCards = productsRef.current.children;
				gsap.fromTo(
					productCards,
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
						stagger: 0.1,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: productsRef.current,
							start: 'top 75%',
							toggleActions: 'play none none reverse',
						},
					},
				);

				// Hover animations
				Array.from(productCards).forEach((card) => {
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
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative py-24 lg:py-32 overflow-hidden bg-black"
		>
			{/* Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.08),transparent_50%)]"></div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16 lg:mb-20">
					<div ref={titleRef} className="mb-6">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
							<span className="text-white">
								Modular solutions
							</span>
						</h2>
					</div>

					<p
						ref={subtitleRef}
						className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
					>
						A fully integrated suite of hiring and assessment
						products. Reduce time-to-hire, grow your team, and run
						your hiring process more efficiently on a fully
						integrated, AI-powered platform.
					</p>
				</div>

				{/* Products Grid */}
				<div
					ref={productsRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{products.map((product, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300 cursor-default"
						>
							{/* Category Badge */}
							<div className="mb-4">
								<Badge
									variant="outline"
									className="border-cyan-400/30 text-cyan-400 bg-cyan-400/10 text-xs px-2 py-0.5"
								>
									{product.category}
								</Badge>
							</div>

							{/* Icon */}
							<div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
								{product.icon}
							</div>

							{/* Content */}
							<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
								{product.title}
							</h3>
							<p className="text-gray-300 leading-relaxed text-sm">
								{product.description}
							</p>

							{/* Hover Effect Gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
