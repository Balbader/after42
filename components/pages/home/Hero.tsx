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
	const constellationMapRef = useRef<SVGSVGElement>(null);
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

			// Constellation map initial animation
			if (constellationMapRef.current) {
				gsap.fromTo(
					constellationMapRef.current,
					{
						opacity: 0,
						rotation: -0.5,
					},
					{
						opacity: 0.6,
						rotation: 0,
						duration: 1.5,
						ease: 'power2.out',
					},
				);
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

	// Constellation map background - grid pattern of stars
	useEffect(() => {
		if (
			typeof window === 'undefined' ||
			!sectionRef.current ||
			!constellationMapRef.current
		)
			return;

		const GRID_SIZE = 50; // Grid spacing for constellation map (reduced for more stars)
		const MAX_CONNECTION_DISTANCE = 100; // Max distance for connections
		const stars: Array<{
			x: number;
			y: number;
			element: SVGCircleElement;
			baseRadius: number;
			baseOpacity: number;
			velocityX: number;
			velocityY: number;
			baseX: number;
			baseY: number;
		}> = [];
		const connections: Array<{
			element: SVGPathElement;
			star1: number;
			star2: number;
		}> = [];

		const createConstellationMap = () => {
			const rect = sectionRef.current?.getBoundingClientRect();
			if (!rect || !constellationMapRef.current) return;

			// Clear existing content
			constellationMapRef.current.innerHTML = '';

			// Create SVG defs
			const defs = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'defs',
			);

			// Star glow filter
			const starGlow = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'filter',
			);
			starGlow.setAttribute('id', 'map-star-glow');
			const feGaussianBlur = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'feGaussianBlur',
			);
			feGaussianBlur.setAttribute('stdDeviation', '1');
			feGaussianBlur.setAttribute('result', 'coloredBlur');
			const feMerge = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'feMerge',
			);
			const feMergeNode1 = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'feMergeNode',
			);
			feMergeNode1.setAttribute('in', 'coloredBlur');
			const feMergeNode2 = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'feMergeNode',
			);
			feMergeNode2.setAttribute('in', 'SourceGraphic');
			feMerge.appendChild(feMergeNode1);
			feMerge.appendChild(feMergeNode2);
			starGlow.appendChild(feGaussianBlur);
			starGlow.appendChild(feMerge);
			defs.appendChild(starGlow);

			// Constellation line gradient
			const lineGradient = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'linearGradient',
			);
			lineGradient.setAttribute('id', 'map-line-gradient');
			lineGradient.setAttribute('x1', '0%');
			lineGradient.setAttribute('y1', '0%');
			lineGradient.setAttribute('x2', '100%');
			lineGradient.setAttribute('y2', '100%');
			const stop1 = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'stop',
			);
			stop1.setAttribute('offset', '0%');
			stop1.setAttribute('stop-color', 'rgba(255, 255, 255, 0.03)');
			const stop2 = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'stop',
			);
			stop2.setAttribute('offset', '50%');
			stop2.setAttribute('stop-color', 'rgba(255, 255, 255, 0.08)');
			const stop3 = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'stop',
			);
			stop3.setAttribute('offset', '100%');
			stop3.setAttribute('stop-color', 'rgba(255, 255, 255, 0.03)');
			lineGradient.appendChild(stop1);
			lineGradient.appendChild(stop2);
			lineGradient.appendChild(stop3);
			defs.appendChild(lineGradient);

			constellationMapRef.current.appendChild(defs);

			// Create stars in grid pattern
			const cols = Math.ceil(rect.width / GRID_SIZE) + 2;
			const rows = Math.ceil(rect.height / GRID_SIZE) + 2;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					// Add some randomness to grid positions
					const offsetX = (Math.random() - 0.5) * 15;
					const offsetY = (Math.random() - 0.5) * 15;
					const x = col * GRID_SIZE + offsetX;
					const y = row * GRID_SIZE + offsetY;

					// Skip stars outside viewport
					if (
						x < -20 ||
						x > rect.width + 20 ||
						y < -20 ||
						y > rect.height + 20
					)
						continue;

					// Star properties - varied sizes
					const isBrightStar = Math.random() < 0.12;
					const baseRadius = isBrightStar
						? 1.5 + Math.random() * 0.5
						: 0.8 + Math.random() * 0.4;
					const baseOpacity = isBrightStar
						? 0.4 + Math.random() * 0.15
						: 0.2 + Math.random() * 0.15;

					const circle = document.createElementNS(
						'http://www.w3.org/2000/svg',
						'circle',
					);
					circle.setAttribute('cx', x.toString());
					circle.setAttribute('cy', y.toString());
					circle.setAttribute('r', baseRadius.toString());
					circle.setAttribute(
						'fill',
						`rgba(255, 255, 255, ${baseOpacity})`,
					);
					circle.setAttribute('filter', 'url(#map-star-glow)');
					circle.style.opacity = '0';

					constellationMapRef.current.appendChild(circle);

					const starIndex = stars.length;
					// Natural movement properties - slow drift
					const velocityX = (Math.random() - 0.5) * 0.15; // -0.075 to 0.075
					const velocityY = (Math.random() - 0.5) * 0.15;

					stars.push({
						x,
						y,
						element: circle,
						baseRadius,
						baseOpacity,
						velocityX,
						velocityY,
						baseX: x,
						baseY: y,
					});

					// Animate star appearance
					gsap.fromTo(
						circle,
						{
							opacity: 0,
							scale: 0,
							attr: { r: 0 },
						},
						{
							opacity: baseOpacity,
							scale: 1,
							attr: { r: baseRadius },
							duration: 0.6 + Math.random() * 0.4,
							delay: (starIndex % 20) * 0.05,
							ease: 'power2.out',
						},
					);

					// Subtle twinkling
					gsap.to(circle, {
						attr: { r: baseRadius * 1.2 },
						opacity: baseOpacity * 1.3,
						duration: 4 + Math.random() * 3,
						ease: 'sine.inOut',
						repeat: -1,
						yoyo: true,
						delay: Math.random() * 2,
					});

					// Create connections to nearby stars
					for (let i = 0; i < starIndex; i++) {
						const otherStar = stars[i];
						const dx = otherStar.x - x;
						const dy = otherStar.y - y;
						const distance = Math.sqrt(dx * dx + dy * dy);

						// Connect nearby stars (constellation pattern)
						if (
							distance <= MAX_CONNECTION_DISTANCE &&
							Math.random() > 0.65
						) {
							const path = document.createElementNS(
								'http://www.w3.org/2000/svg',
								'path',
							);
							path.setAttribute(
								'd',
								`M ${x} ${y} L ${otherStar.x} ${otherStar.y}`,
							);
							path.setAttribute('fill', 'none');
							path.setAttribute(
								'stroke',
								'url(#map-line-gradient)',
							);
							path.setAttribute(
								'stroke-width',
								(0.3 + Math.random() * 0.2).toString(),
							);
							path.style.opacity = '0';
							path.style.strokeLinecap = 'round';

							constellationMapRef.current.appendChild(path);
							connections.push({
								element: path,
								star1: i,
								star2: starIndex,
							});

							// Animate connection appearance
							requestAnimationFrame(() => {
								const pathLength = path.getTotalLength();
								path.style.strokeDasharray = `${pathLength}`;
								path.style.strokeDashoffset = `${pathLength}`;

								gsap.to(path, {
									opacity: 0.15 + Math.random() * 0.1,
									attr: { 'stroke-dashoffset': 0 },
									duration: 1.2 + Math.random() * 0.5,
									delay: (starIndex % 15) * 0.03,
									ease: 'power2.out',
								});
							});
						}
					}
				}
			}
		};

		createConstellationMap();

		// Continuous natural movement animation
		let animationFrameId: number;
		const updateStarPositions = () => {
			const rect = sectionRef.current?.getBoundingClientRect();
			if (!rect) {
				animationFrameId = requestAnimationFrame(updateStarPositions);
				return;
			}

			stars.forEach((star, index) => {
				// Natural circular drift around base position
				const time = Date.now() * 0.001; // Slow time multiplier
				const driftRadius = 15 + (index % 3) * 10; // Vary drift radius (15-35px)
				const driftSpeed = 0.2 + (index % 7) * 0.05; // Vary drift speed (0.2-0.5)
				const angle = time * driftSpeed + index * 0.5; // Unique angle per star
				const offsetX = Math.cos(angle) * driftRadius;
				const offsetY = Math.sin(angle) * driftRadius;

				const currentX = star.baseX + offsetX;
				const currentY = star.baseY + offsetY;

				// Boundary check - wrap around
				let finalX = currentX;
				let finalY = currentY;
				if (finalX < -50) finalX = rect.width + 50;
				if (finalX > rect.width + 50) finalX = -50;
				if (finalY < -50) finalY = rect.height + 50;
				if (finalY > rect.height + 50) finalY = -50;

				// Update SVG element position
				star.element.setAttribute('cx', finalX.toString());
				star.element.setAttribute('cy', finalY.toString());

				// Update star position for connection calculations
				star.x = finalX;
				star.y = finalY;
			});

			// Update connection paths
			connections.forEach((conn) => {
				const star1 = stars[conn.star1];
				const star2 = stars[conn.star2];
				if (star1 && star2) {
					conn.element.setAttribute(
						'd',
						`M ${star1.x} ${star1.y} L ${star2.x} ${star2.y}`,
					);
				}
			});

			animationFrameId = requestAnimationFrame(updateStarPositions);
		};

		// Start movement animation
		updateStarPositions();

		// Handle window resize
		const handleResize = () => {
			createConstellationMap();
			// Restart movement animation after resize
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
			updateStarPositions();
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
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

			{/* Constellation map background - grid pattern */}
			<svg
				ref={constellationMapRef}
				className="absolute inset-0 w-full h-full pointer-events-none opacity-60 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] transition-opacity duration-500"
				style={{ overflow: 'visible' }}
			></svg>

			{/* Animated gradient orbs */}
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
