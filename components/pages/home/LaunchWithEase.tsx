'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface Option {
	icon: string;
	title: string;
	description: string;
	link: string;
}

const options: Option[] = [
	{
		icon: '🔌',
		title: 'Use a pre-integrated platform',
		description:
			'Explore our directory to find pre-built solutions that connect with After-42.',
		link: 'See directory',
	},
	{
		icon: '👥',
		title: 'Build with certified experts',
		description:
			'Work with an After-42 consulting partner that can integrate and deploy solutions for you.',
		link: 'View partners',
	},
	{
		icon: '🚀',
		title: 'Try our no-code products',
		description:
			'Upload a job description, get AI-generated challenges, and start generating matches in minutes—no code required.',
		link: 'Explore no-code',
	},
];

export default function LaunchWithEase() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const optionsRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

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

			// Options animation
			if (optionsRef.current) {
				const optionCards = optionsRef.current.children;
				gsap.fromTo(
					optionCards,
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
							trigger: optionsRef.current,
							start: 'top 75%',
							toggleActions: 'play none none reverse',
						},
					},
				);
			}

			// CTA animation
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
							<span className="text-white">Launch with ease</span>
						</h2>
						<p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							Low- and no-code options for getting started. If
							you&apos;d like to use After-42 but don&apos;t have
							developers on staff, no problem.
						</p>
					</div>
				</div>

				{/* Options Grid */}
				<div
					ref={optionsRef}
					className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
				>
					{options.map((option, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300"
						>
							{/* Icon */}
							<div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
								{option.icon}
							</div>

							{/* Content */}
							<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
								{option.title}
							</h3>
							<p className="text-gray-300 leading-relaxed text-sm mb-4">
								{option.description}
							</p>

							{/* Link */}
							<Button
								variant="ghost"
								className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 p-0 h-auto font-medium text-sm"
							>
								{option.link} →
							</Button>

							{/* Hover Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
						</div>
					))}
				</div>

				{/* Final CTA */}
				<div ref={ctaRef} className="text-center">
					<div className="bg-gradient-to-r from-cyan-400/20 via-cyan-500/15 to-cyan-600/20 border-2 border-cyan-400/40 rounded-xl px-8 py-12 sm:px-12 backdrop-blur-md shadow-2xl shadow-cyan-500/20 max-w-3xl mx-auto">
						<h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
							Ready to get started?
						</h3>
						<p className="text-gray-300 mb-8 text-lg">
							Create an account instantly to get started or
							contact us to design a custom package for your
							business.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<RegisterLink>
								<Button
									size="lg"
									className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-cyan-600 text-black hover:from-cyan-500 hover:to-cyan-700 font-medium shadow-lg shadow-cyan-500/30"
								>
									Get Started
								</Button>
							</RegisterLink>
							<Button
								variant="outline"
								size="lg"
								className="w-full sm:w-auto border-cyan-400/50 text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20"
							>
								Contact Sales
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
