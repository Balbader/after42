'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
	icon: string;
	title: string;
	description: string;
	link: string;
}

const features: Feature[] = [
	{
		icon: '📝',
		title: 'Upload Job Description',
		description:
			'Simply upload your job post. Our platform accepts any format—PDF, text, or direct input.',
		link: 'Try it now',
	},
	{
		icon: '🤖',
		title: 'AI Challenge Generator',
		description:
			'Our AI transforms your requirements into tailored coding challenges that test exact skills.',
		link: 'Learn more',
	},
	{
		icon: '⚡',
		title: 'Quick Assessment',
		description:
			'Get matched with verified developers in days, not weeks. Skip the endless screening cycles.',
		link: 'Get started',
	},
];

export default function BuiltForGrowth() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);

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

			// Features animation
			if (featuresRef.current) {
				const featureCards = featuresRef.current.children;
				gsap.fromTo(
					featureCards,
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
							trigger: featuresRef.current,
							start: 'top 75%',
							toggleActions: 'play none none reverse',
						},
					},
				);
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
								Take your startup further, faster
							</span>
						</h2>
						<p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							Startups build on After-42 to launch faster, adapt
							as they grow, and automate workflows to do more with
							less.
						</p>
					</div>
				</div>

				{/* Features Grid */}
				<div
					ref={featuresRef}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{features.map((feature, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-8 hover:border-cyan-400/30 transition-all duration-300"
						>
							{/* Icon */}
							<div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
								{feature.icon}
							</div>

							{/* Content */}
							<h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
								{feature.title}
							</h3>
							<p className="text-gray-300 leading-relaxed mb-6">
								{feature.description}
							</p>

							{/* Link */}
							<Button
								variant="ghost"
								className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-0 h-auto font-medium"
							>
								{feature.link} →
							</Button>

							{/* Hover Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
