'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import Link from 'next/link';

export default function Header() {
	const headerRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const navRef = useRef<HTMLElement>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		// Entrance animation
		const tl = gsap.timeline();

		if (logoRef.current) {
			tl.from(logoRef.current, {
				y: -20,
				opacity: 0,
				duration: 0.6,
				ease: 'power3.out',
			});
		}

		if (navRef.current) {
			tl.from(
				navRef.current.children,
				{
					y: -10,
					opacity: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: 'power2.out',
				},
				'-=0.3',
			);
		}

		// Scroll handler for background change
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > 100) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const navItems = [
		{ label: 'Developers', href: '/developers' },
		{ label: 'Startups', href: '/startups' },
		{ label: 'Enterprises', href: '/enterprises' },
		{ label: '42 School', href: '/42-school' },
		{ label: 'Blog', href: '/blog' },
	];

	return (
		<header
			ref={headerRef}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? 'bg-black/95 backdrop-blur-md border-b border-cyan-400/20 shadow-lg shadow-black/20'
					: 'bg-black/40 backdrop-blur-sm'
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo */}
					<div ref={logoRef} className="flex items-center">
						<Link
							href="/home"
							className="flex items-baseline group cursor-pointer"
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.05,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
						>
							<h1 className="text-xl sm:text-2xl font-bold tracking-tighter font-source-code-pro">
								<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
									AFTER
								</span>
								<span className="text-white">-42</span>
							</h1>
							<Badge
								variant="outline"
								className="ml-2 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-[10px] sm:text-xs px-1.5 py-0"
							>
								Beta
							</Badge>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav
						ref={navRef}
						className="hidden md:flex items-center gap-8"
					>
						{navItems.map((item, index) => (
							<Link
								href={item.href}
								key={item.href}
								className="text-sm font-medium text-white hover:text-cyan-400 transition-colors duration-200 relative group drop-shadow-sm"
								onMouseEnter={(e) => {
									gsap.to(e.currentTarget, {
										y: -2,
										duration: 0.2,
										ease: 'power2.out',
									});
								}}
								onMouseLeave={(e) => {
									gsap.to(e.currentTarget, {
										y: 0,
										duration: 0.2,
										ease: 'power2.out',
									});
								}}
							>
								{item.label}
							</Link>
						))}
					</nav>

					{/* CTA Button */}
					<div className="hidden md:flex items-center gap-4">
						<Button
							variant="ghost"
							asChild
							className="text-white hover:text-cyan-300 hover:bg-cyan-400/20 border-transparent hover:border-cyan-400/60 font-medium transition-all duration-200"
						>
							<Link href="/dashboard">Sign In</Link>
						</Button>
						<Button
							asChild
							className="bg-gradient-to-r from-cyan-400 to-cyan-600 text-black hover:from-cyan-500 hover:to-cyan-700 border-0 font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.05,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									duration: 0.2,
									ease: 'power2.out',
								});
							}}
						>
							<Link href="/dashboard">Get Started</Link>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-white hover:text-cyan-400 transition-colors drop-shadow-sm"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							{isMobileMenuOpen ? (
								<path d="M6 18L18 6M6 6l12 12" />
							) : (
								<path d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>

				{/* Mobile Menu */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
						isMobileMenuOpen
							? 'max-h-96 opacity-100'
							: 'max-h-0 opacity-0'
					}`}
				>
					<nav className="py-4 space-y-4 border-t border-cyan-400/20 mt-2">
						{navItems.map((item) => (
							<Link
								href={item.href}
								key={item.href}
								className="block text-white hover:text-cyan-400 transition-colors duration-200 py-2 font-medium"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{item.label}
							</Link>
						))}
						<div className="flex flex-col gap-2 pt-4">
							<Button
								variant="ghost"
								asChild
								className="w-full text-white hover:text-cyan-300 hover:bg-cyan-400/20 justify-start font-medium transition-all duration-200"
							>
								<Link href="/dashboard">Sign In</Link>
							</Button>
							<Button
								asChild
								className="w-full bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 font-bold"
							>
								<Link href="/dashboard">Get Started</Link>
							</Button>
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}
