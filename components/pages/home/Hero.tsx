'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
	const sectionRef = useRef<HTMLElement>(null);
	const gradientRef = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const quoteRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate background gradient
			if (gradientRef.current) {
				gsap.fromTo(
					gradientRef.current,
					{
						opacity: 0,
						scale: 0.8,
					},
					{
						opacity: 1,
						scale: 1,
						duration: 1.5,
						ease: 'power2.out',
					},
				);

				// Continuous subtle pulse animation
				gsap.to(gradientRef.current, {
					scale: 1.1,
					duration: 4,
					ease: 'power1.inOut',
					repeat: -1,
					yoyo: true,
				});
			}

			// Create timeline for sequential animations
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			// Logo animation
			if (logoRef.current) {
				tl.from(logoRef.current, {
					y: 30,
					opacity: 0,
					duration: 0.8,
				});
			}

			// Badge animation
			if (badgeRef.current) {
				tl.from(
					badgeRef.current,
					{
						y: 20,
						opacity: 0,
						scale: 0.9,
						duration: 0.6,
					},
					'-=0.4',
				);
			}

			// Title animation with word-by-word reveal
			if (titleRef.current) {
				const words = titleRef.current.querySelectorAll('span');
				tl.from(
					words,
					{
						y: 40,
						opacity: 0,
						duration: 0.8,
						stagger: 0.1,
						rotationX: -90,
					},
					'-=0.3',
				);
			}

			// Quote animation
			if (quoteRef.current) {
				tl.from(
					quoteRef.current,
					{
						y: 30,
						opacity: 0,
						duration: 0.8,
					},
					'-=0.4',
				);
			}

			// CTA buttons animation - enhanced entrance
			if (ctaRef.current) {
				// Ensure buttons container is visible first
				gsap.set(ctaRef.current, {
					opacity: 1,
					visibility: 'visible',
				});

				// Set initial state for button children with more dramatic start
				gsap.set(ctaRef.current.children, {
					opacity: 0,
					y: 40,
					scale: 0.8,
					rotationX: -90,
				});

				// Enhanced entrance animation with bounce and scale
				tl.to(
					ctaRef.current.children,
					{
						y: 0,
						opacity: 1,
						scale: 1,
						rotationX: 0,
						duration: 0.8,
						stagger: 0.15,
						ease: 'back.out(1.7)',
					},
					'-=0.3',
				);

				// Add subtle continuous glow animation to primary button
				const primaryButton = ctaRef.current.children[1];
				if (primaryButton) {
					gsap.to(primaryButton, {
						boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)',
						duration: 2,
						ease: 'power1.inOut',
						repeat: -1,
						yoyo: true,
					});
				}
			}

			// Scroll-triggered exit animation - only fade content, keep background dark
			if (sectionRef.current) {
				// Only fade content, not the entire section (keeps dark background)
				// Buttons are now outside this container so they stay visible
				const content =
					sectionRef.current.querySelector('.hero-content');
				if (content) {
					gsap.to(content, {
						scrollTrigger: {
							trigger: sectionRef.current,
							start: 'top top',
							end: 'bottom top',
							scrub: 1,
						},
						opacity: 0.3,
						y: -80,
						ease: 'power1.inOut',
					});
				}

				// Ensure buttons stay visible and unaffected by scroll
				if (ctaRef.current) {
					gsap.set(ctaRef.current, {
						opacity: 1,
						visibility: 'visible',
					});
					// Ensure button children stay visible
					gsap.set(ctaRef.current.children, {
						opacity: 1,
					});
				}

				// Subtle scale on section, but keep it visible
				gsap.to(sectionRef.current, {
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top top',
						end: 'bottom top',
						scrub: 1,
					},
					scale: 0.99,
					ease: 'power1.inOut',
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
		>
			{/* Animated Background Gradient */}
			<div
				ref={gradientRef}
				className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_50%)]"
			></div>

			{/* Additional animated gradient layers */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.08),transparent_50%)] animate-pulse"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08),transparent_50%)]"></div>

			{/* Content Container - Centered */}
			<div className="relative min-h-screen flex flex-col items-center justify-center">
				{/* Content */}
				<div className="hero-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="text-center">
						{/* Logo */}
						<div
							ref={logoRef}
							className="flex flex-col items-center justify-center mb-6"
						>
							<h1 className="text-3xl text-center sm:text-4xl md:text-5xl font-semibold tracking-tighter flex flex-row items-baseline font-source-code-pro group cursor-pointer">
								<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-cyan-300 group-hover:to-cyan-500">
									AFTER
								</span>
								<span className="text-white transition-colors duration-300 group-hover:text-cyan-400">
									-42
								</span>
								<span className="text-xs sm:text-sm text-gray-400 pl-2">
									Beta
								</span>
							</h1>
						</div>

						{/* Badge */}
						<div
							ref={badgeRef}
							className="flex justify-center mb-8"
						>
							<Badge
								variant="outline"
								className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-sm px-4 py-1.5 backdrop-blur-sm hover:bg-cyan-400/20 transition-all duration-300 cursor-default"
							>
								🚀 AI-Powered Hiring Platform
							</Badge>
						</div>

						{/* Main Title */}
						<h1
							ref={titleRef}
							className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-8"
						>
							<span className="text-white inline-block">
								<span className="inline-block">Discover</span>{' '}
								<span className="inline-block">and</span>{' '}
								<span className="inline-block">hire</span>
							</span>
							<br />
							<span className="text-white inline-block">
								<span className="inline-block">the</span>{' '}
								<span className="inline-block bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
									best
								</span>{' '}
								<span className="inline-block">42</span>{' '}
								<span className="inline-block">developers</span>
							</span>
							<br />
							<span className="text-white inline-block">
								<span className="inline-block">with</span>{' '}
								<span className="inline-block">ease.</span>
							</span>
						</h1>

						{/* Quote */}
						<p
							ref={quoteRef}
							className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed italic"
						>
							&quot;The smartest companies will hire more software
							engineers,
							<br className="hidden sm:block" /> not fewer, as AI
							develops.&quot;
							<br />
							<span className="text-cyan-400/80 not-italic text-base sm:text-lg mt-2 block">
								- Thomas Dohmke, CEO of GitHub
							</span>
						</p>
					</div>

					{/* CTA Buttons - Outside hero-content to avoid opacity inheritance */}
					<div
						ref={ctaRef}
						className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-center gap-4 z-20 mt-8"
						style={{ opacity: 1 }}
					>
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto border-cyan-400/50 text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group"
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.08,
									y: -4,
									duration: 0.3,
									ease: 'back.out(1.4)',
								});
								gsap.to(e.currentTarget, {
									boxShadow:
										'0 8px 25px rgba(6, 182, 212, 0.3)',
									duration: 0.3,
									ease: 'power2.out',
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									y: 0,
									duration: 0.3,
									ease: 'power2.out',
								});
								gsap.to(e.currentTarget, {
									boxShadow: '0 0px 0px rgba(6, 182, 212, 0)',
									duration: 0.3,
									ease: 'power2.out',
								});
							}}
						>
							<span className="relative z-10">Learn More</span>
						</Button>
						<Button
							size="lg"
							className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-cyan-600 text-black hover:from-cyan-500 hover:to-cyan-700 border-0 font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 relative overflow-hidden group"
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.1,
									y: -6,
									duration: 0.3,
									ease: 'back.out(1.4)',
								});
								gsap.to(e.currentTarget, {
									boxShadow:
										'0 25px 50px rgba(6, 182, 212, 0.5)',
									duration: 0.3,
									ease: 'power2.out',
								});
								// Add a subtle rotation for extra dynamism
								gsap.to(e.currentTarget, {
									rotation: 1,
									duration: 0.3,
									ease: 'power2.out',
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									y: 0,
									rotation: 0,
									duration: 0.4,
									ease: 'elastic.out(1, 0.5)',
								});
								gsap.to(e.currentTarget, {
									boxShadow:
										'0 10px 30px rgba(6, 182, 212, 0.3)',
									duration: 0.4,
									ease: 'power2.out',
								});
							}}
						>
							<span className="relative z-10">Get Notified</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<svg
					className="w-6 h-6 text-cyan-400/60"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
				</svg>
			</div>

			{/* Transition Gradient - smooth fade to next section */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none"></div>
		</section>
	);
}
