'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HeroSection } from './hero-section';
import { HowItWorksSection } from './how-it-works-section';
import { StandardSection } from './standard-section';
import { VisionSection } from './vision-section';
import { CtaSection } from './cta-section';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
	const rootRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const el = rootRef.current;
		if (!el) return;

		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduced) return;

		const ctx = gsap.context(() => {
			gsap.from('.home-hero-anim', {
				opacity: 0,
				y: 28,
				duration: 0.75,
				ease: 'power3.out',
				stagger: 0.11,
				delay: 0.05,
			});

			gsap.from('.home-hero-preview', {
				opacity: 0,
				x: 36,
				duration: 0.85,
				ease: 'power3.out',
				delay: 0.25,
			});

			gsap.to('.home-hero-preview-inner', {
				y: -5,
				duration: 2.8,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
			});

			gsap.utils.toArray<HTMLElement>('.home-reveal-block').forEach((block) => {
				gsap.from(block, {
					opacity: 0,
					y: 32,
					duration: 0.65,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: block,
						start: 'top 90%',
						once: true,
					},
				});
			});

			gsap.from('.home-reveal-stagger .home-reveal-item', {
				opacity: 0,
				y: 26,
				duration: 0.55,
				stagger: 0.12,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.home-reveal-stagger',
					start: 'top 88%',
					once: true,
				},
			});

			gsap.from('.home-cta-inner', {
				opacity: 0,
				y: 24,
				duration: 0.7,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.home-cta-section',
					start: 'top 85%',
					once: true,
				},
			});
		}, el);

		return () => {
			ctx.revert();
		};
	}, []);

	return (
		<main
			ref={rootRef}
			className='min-h-screen bg-[var(--a42-bg)] text-[var(--a42-text)]'
		>
			<HeroSection />
			<HowItWorksSection />
			<StandardSection />
			<VisionSection />
			<CtaSection />
		</main>
	);
}
