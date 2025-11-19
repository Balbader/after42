'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

interface Story {
	company: string;
	logo: string;
	quote: string;
	author: string;
	role: string;
	metrics: {
		label: string;
		value: string;
		change?: string;
	}[];
}

const stories: Story[] = [
	{
		company: 'TechCorp',
		logo: '🏢',
		quote: 'After-42 transformed our hiring process. We found three exceptional developers in just two weeks, all with verified skills that matched exactly what we needed.',
		author: 'Sarah Johnson',
		role: 'CTO',
		metrics: [
			{ label: 'Time to hire', value: '2 weeks', change: '-60%' },
			{ label: 'Quality matches', value: '95%', change: '+40%' },
		],
	},
	{
		company: 'StartupXYZ',
		logo: '🚀',
		quote: 'The AI challenge generator created perfect assessments for our stack. We finally have a way to verify skills before interviews.',
		author: 'Michael Chen',
		role: 'Engineering Lead',
		metrics: [
			{ label: 'Interview efficiency', value: '3x', change: '+200%' },
			{ label: 'Hired developers', value: '12', change: '+150%' },
		],
	},
	{
		company: 'ScaleUp Inc',
		logo: '📈',
		quote: 'Focusing on 42 graduates was a game-changer. These developers have proven ability to learn and adapt—exactly what we need for our growing team.',
		author: 'Emma Rodriguez',
		role: 'VP of Engineering',
		metrics: [
			{ label: 'Team growth', value: '50%', change: '+50%' },
			{ label: 'Retention rate', value: '98%', change: '+25%' },
		],
	},
];

export default function CustomerStories() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const storiesRef = useRef<HTMLDivElement>(null);

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

			// Stories animation with stagger
			if (storiesRef.current) {
				const storyCards = storiesRef.current.children;
				gsap.fromTo(
					storyCards,
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
						stagger: 0.2,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: storiesRef.current,
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
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_50%)]"></div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16 lg:mb-20">
					<div ref={titleRef} className="mb-6">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
							<span className="text-white">Built for growth</span>
						</h2>
						<p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							Companies build on After-42 to hire faster, scale
							their teams, and automate workflows to do more with
							less.
						</p>
					</div>
				</div>

				{/* Stories Grid */}
				<div
					ref={storiesRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{stories.map((story, index) => (
						<div
							key={index}
							className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300"
						>
							{/* Company Logo */}
							<div className="text-4xl mb-4">{story.logo}</div>

							{/* Quote */}
							<blockquote className="text-gray-300 mb-6 leading-relaxed italic">
								&quot;{story.quote}&quot;
							</blockquote>

							{/* Author */}
							<div className="mb-6 pb-6 border-b border-cyan-400/10">
								<p className="text-white font-semibold">
									{story.author}
								</p>
								<p className="text-gray-400 text-sm">
									{story.role}
								</p>
								<p className="text-cyan-400 text-sm mt-1">
									{story.company}
								</p>
							</div>

							{/* Metrics */}
							<div className="space-y-3">
								{story.metrics.map((metric, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center"
									>
										<span className="text-gray-400 text-sm">
											{metric.label}
										</span>
										<div className="text-right">
											<span className="text-white font-semibold">
												{metric.value}
											</span>
											{metric.change && (
												<span className="text-cyan-400 text-sm ml-2">
													{metric.change}
												</span>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Hover Effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
