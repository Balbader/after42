'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
	const sectionRef = useRef<HTMLElement>(null);
	const gradientRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const orb1Ref = useRef<HTMLDivElement>(null);
	const orb2Ref = useRef<HTMLDivElement>(null);
	const orb3Ref = useRef<HTMLDivElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const quoteRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Enhanced background gradient animations
			if (gradientRef.current) {
				gsap.fromTo(
					gradientRef.current,
					{
						opacity: 0,
						scale: 0.8,
						rotation: -5,
					},
					{
						opacity: 1,
						scale: 1,
						rotation: 0,
						duration: 1.5,
						ease: 'power2.out',
					},
				);

				// Multi-layered continuous animations
				gsap.to(gradientRef.current, {
					scale: 1.15,
					rotation: 2,
					duration: 6,
					ease: 'power1.inOut',
					repeat: -1,
					yoyo: true,
				});

				// Additional subtle movement
				gsap.to(gradientRef.current, {
					x: 30,
					y: 20,
					duration: 8,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true,
				});
			}

			// Enhanced grid animations with rotation
			if (gridRef.current) {
				gsap.fromTo(
					gridRef.current,
					{
						opacity: 0,
						rotation: -1,
					},
					{
						opacity: 0.22,
						rotation: 0,
						duration: 1.2,
						ease: 'power2.out',
					},
				);

				// Subtle continuous rotation
				gsap.to(gridRef.current, {
					rotation: 1,
					duration: 20,
					ease: 'none',
					repeat: -1,
					yoyo: true,
				});
			}

			// Enhanced orb animations with floating and rotation
			if (orb1Ref.current) {
				gsap.fromTo(
					orb1Ref.current,
					{
						opacity: 0,
						scale: 0.5,
					},
					{
						opacity: 0.15,
						scale: 1,
						duration: 2,
						ease: 'power2.out',
					},
				);

				// Floating animation
				gsap.to(orb1Ref.current, {
					y: -40,
					x: 30,
					duration: 5,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true,
				});

				// Pulsing scale
				gsap.to(orb1Ref.current, {
					scale: 1.2,
					duration: 4,
					ease: 'power1.inOut',
					repeat: -1,
					yoyo: true,
				});
			}

			if (orb2Ref.current) {
				gsap.fromTo(
					orb2Ref.current,
					{
						opacity: 0,
						scale: 0.5,
					},
					{
						opacity: 0.1,
						scale: 1,
						duration: 2.2,
						ease: 'power2.out',
					},
				);

				// Floating animation (opposite direction)
				gsap.to(orb2Ref.current, {
					y: 50,
					x: -40,
					duration: 6,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true,
				});

				// Pulsing scale
				gsap.to(orb2Ref.current, {
					scale: 1.15,
					duration: 5,
					ease: 'power1.inOut',
					repeat: -1,
					yoyo: true,
				});
			}

			// Third orb for more depth
			if (orb3Ref.current) {
				gsap.fromTo(
					orb3Ref.current,
					{
						opacity: 0,
						scale: 0.3,
					},
					{
						opacity: 0.08,
						scale: 1,
						duration: 2.5,
						ease: 'power2.out',
						delay: 0.5,
					},
				);

				// Floating animation
				gsap.to(orb3Ref.current, {
					y: -30,
					x: -20,
					duration: 7,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true,
				});

				// Pulsing scale
				gsap.to(orb3Ref.current, {
					scale: 1.1,
					duration: 4.5,
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

			// CTA buttons animation - elegant entrance
			if (ctaRef.current) {
				// Ensure buttons container is visible first
				gsap.set(ctaRef.current, {
					opacity: 1,
					visibility: 'visible',
				});

				// Set initial state for button children - subtle and elegant
				gsap.set(ctaRef.current.children, {
					opacity: 0,
					y: 20,
					scale: 0.96,
				});

				// Elegant entrance animation - smooth fade and gentle lift
				tl.to(
					ctaRef.current.children,
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.7,
						stagger: 0.1,
						ease: 'power2.out',
					},
					'-=0.2',
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

	// Mouse interaction for background elements - separate effect for proper cleanup
	useEffect(() => {
		if (typeof window === 'undefined' || !sectionRef.current) return;

		let currentX = 0;
		let currentY = 0;
		let targetX = 0;
		let targetY = 0;
		let animationFrameId: number;

		// Lerp function for smooth interpolation
		const lerp = (start: number, end: number, factor: number) => {
			return start + (end - start) * factor;
		};

		const handleMouseMove = (e: MouseEvent) => {
			const rect = sectionRef.current?.getBoundingClientRect();
			if (rect) {
				// Calculate normalized position (-1 to 1)
				targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
				targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
			}
		};

		// Smooth interpolation for mouse movement
		const updateMousePosition = () => {
			// Smoothly interpolate to target position
			currentX = lerp(currentX, targetX, 0.1);
			currentY = lerp(currentY, targetY, 0.1);

			// Enhanced gradient animation with rotation
			if (gradientRef.current) {
				gsap.to(gradientRef.current, {
					x: currentX * 40,
					y: currentY * 40,
					rotation: currentX * 2,
					scale:
						1 +
						Math.abs(currentX) * 0.05 +
						Math.abs(currentY) * 0.05,
					duration: 0.6,
					ease: 'power2.out',
				});
			}

			// Enhanced grid animation with rotation and dynamic opacity
			if (gridRef.current) {
				const gridOpacity =
					0.22 + Math.abs(currentX) * 0.1 + Math.abs(currentY) * 0.1;
				gsap.to(gridRef.current, {
					x: currentX * 25,
					y: currentY * 25,
					rotation: currentX * 0.5,
					opacity: gridOpacity,
					duration: 0.6,
					ease: 'power2.out',
				});
			}

			// Enhanced orb animations with stronger parallax and rotation
			if (orb1Ref.current) {
				gsap.to(orb1Ref.current, {
					x: currentX * 100,
					y: currentY * 100,
					rotation: currentX * 15,
					scale:
						1 +
						Math.abs(currentX) * 0.25 +
						Math.abs(currentY) * 0.25,
					opacity: 0.18 + Math.abs(currentX) * 0.12,
					duration: 0.8,
					ease: 'power2.out',
				});
			}

			if (orb2Ref.current) {
				gsap.to(orb2Ref.current, {
					x: currentX * -80,
					y: currentY * -80,
					rotation: currentY * -12,
					scale:
						1 + Math.abs(currentX) * 0.2 + Math.abs(currentY) * 0.2,
					opacity: 0.12 + Math.abs(currentY) * 0.1,
					duration: 0.8,
					ease: 'power2.out',
				});
			}

			if (orb3Ref.current) {
				gsap.to(orb3Ref.current, {
					x: currentX * 50,
					y: currentY * -50,
					rotation: (currentX + currentY) * 10,
					scale:
						1 +
						Math.abs(currentX) * 0.15 +
						Math.abs(currentY) * 0.15,
					opacity: 0.1 + Math.abs(currentX + currentY) * 0.05,
					duration: 0.8,
					ease: 'power2.out',
				});
			}

			animationFrameId = requestAnimationFrame(updateMousePosition);
		};

		window.addEventListener('mousemove', handleMouseMove);
		updateMousePosition();

		// Cleanup
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative min-h-screen overflow-hidden bg-black"
		>
			{/* Sleek Animated Background */}
			<div
				ref={gradientRef}
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_70%)]"
			></div>

			{/* Enhanced grid pattern - more visible */}
			<div
				ref={gridRef}
				className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.18)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] transition-opacity duration-500"
			></div>

			{/* Animated gradient orbs - with refs for mouse interaction */}
			<div
				ref={orb1Ref}
				className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl transition-all duration-500"
			></div>
			<div
				ref={orb2Ref}
				className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl transition-all duration-500"
			></div>
			<div
				ref={orb3Ref}
				className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan-300/8 rounded-full blur-3xl transition-all duration-500"
			></div>

			{/* Content Container - Centered */}
			<div className="relative min-h-screen flex flex-col items-center justify-center">
				{/* Content */}
				<div className="hero-content relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="text-center">
						{/* Badge - More subtle */}
						<div
							ref={badgeRef}
							className="flex justify-center mb-8"
						>
							<Badge
								variant="outline"
								className="border-cyan-400/30 text-cyan-400/90 bg-cyan-400/5 text-xs px-3 py-1 backdrop-blur-md hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300 cursor-default font-normal tracking-wide"
							>
								AI-Powered Hiring Platform
							</Badge>
						</div>

						{/* Main Title - Sleeker typography */}
						<h1
							ref={titleRef}
							className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
						>
							<span className="text-white block">
								DISCOVER AND HIRE
							</span>
							<span className="block mt-2">
								<span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
									THE BEST
									<span className="text-white">
										{' '}
										42 DEVELOPERS{' '}
									</span>
								</span>
							</span>
						</h1>

						{/* Subtitle - More refined */}
						<p
							ref={quoteRef}
							className="text-base sm:text-lg lg:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
						>
							No more endless CVs. No more wasted interviews. No
							more bad hires.
							<br />{' '}
							<span className="text-white font-medium">
								Just verified talent that fits your needs
								<span className="text-cyan-400/90 font-bold">
									{' '}
									perfectly
								</span>
								.
							</span>
						</p>
					</div>

					{/* CTA Buttons - Sleeker design */}
					<div
						ref={ctaRef}
						className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col sm:flex-row items-center justify-center gap-3 z-20"
						style={{ opacity: 1 }}
					>
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto border-cyan-400/30 text-cyan-400/90 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-300 backdrop-blur-md relative overflow-hidden group px-8 h-12 text-sm font-medium tracking-wide"
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.02,
									y: -2,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									y: 0,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
						>
							Learn More
						</Button>
						<Link href="/dashboard">
							<Button
								size="lg"
								className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:from-cyan-300 hover:to-cyan-400 border-0 font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 relative overflow-hidden px-8 h-12 text-sm tracking-wide"
								onMouseEnter={(e) => {
									gsap.to(e.currentTarget, {
										scale: 1.02,
										y: -2,
										duration: 0.2,
										ease: 'power2.out',
									});
									gsap.to(e.currentTarget, {
										boxShadow:
											'0 20px 40px rgba(6, 182, 212, 0.4)',
										duration: 0.2,
										ease: 'power2.out',
									});
								}}
								onMouseLeave={(e) => {
									gsap.to(e.currentTarget, {
										scale: 1,
										y: 0,
										duration: 0.2,
										ease: 'power2.out',
									});
									gsap.to(e.currentTarget, {
										boxShadow:
											'0 10px 30px rgba(6, 182, 212, 0.2)',
										duration: 0.2,
										ease: 'power2.out',
									});
								}}
							>
								Get Started
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Smooth Transition Gradient */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-black/30 to-black pointer-events-none"></div>
		</section>
	);
}
