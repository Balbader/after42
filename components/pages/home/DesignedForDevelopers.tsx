'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function DesignedForDevelopers() {
	const sectionRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

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

			// Content animation
			if (contentRef.current) {
				gsap.fromTo(
					contentRef.current,
					{
						y: 40,
						opacity: 0,
					},
					{
						y: 0,
						opacity: 1,
						duration: 0.8,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: contentRef.current,
							start: 'top 80%',
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
								Designed for developers
							</span>
						</h2>
						<p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							Ship faster with powerful and easy-to-use APIs. We
							handle the complexity of hiring so your teams can
							build what you need.
						</p>
					</div>
				</div>

				{/* Content */}
				<div ref={contentRef} className="text-center">
					<div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-12 max-w-4xl mx-auto">
						<div className="text-6xl mb-6">💻</div>
						<h3 className="text-2xl font-semibold text-white mb-4">
							Use After-42 with your stack
						</h3>
						<p className="text-gray-300 mb-8 leading-relaxed">
							We offer integrations and APIs that work with
							everything from React and Node.js to Python and Go.
							Build your own integration or use our pre-built
							solutions.
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<Button
								variant="outline"
								className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20"
							>
								Read the docs
							</Button>
							<Button className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-black hover:from-cyan-500 hover:to-cyan-700">
								View API reference
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
