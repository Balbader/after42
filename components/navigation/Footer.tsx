'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface FooterLink {
	label: string;
	href: string;
}

interface FooterSection {
	title: string;
	links: FooterLink[];
}

const footerSections: FooterSection[] = [
	{
		title: 'Products & Pricing',
		links: [
			{ label: 'Pricing', href: '/pricing' },
			{
				label: 'AI Challenge Generator',
				href: '/products/challenge-generator',
			},
			{
				label: 'Skill Verification',
				href: '/products/skill-verification',
			},
			{ label: 'Developer Profiles', href: '/products/profiles' },
			{ label: 'Intelligent Matching', href: '/products/matching' },
			{ label: 'API', href: '/products/api' },
		],
	},
	{
		title: 'Solutions',
		links: [
			{ label: 'For Startups', href: '/solutions/startups' },
			{ label: 'For Enterprises', href: '/solutions/enterprises' },
			{ label: 'For Developers', href: '/solutions/developers' },
			{ label: 'For Companies', href: '/solutions/companies' },
			{ label: '42 School Focus', href: '/solutions/42-school' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ label: 'Documentation', href: '/docs' },
			{ label: 'API Reference', href: '/docs/api' },
			{ label: 'API Status', href: '/status' },
			{ label: 'Libraries & SDKs', href: '/docs/libraries' },
			{ label: 'Developer Blog', href: '/blog' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ label: 'Guides', href: '/guides' },
			{ label: 'Customer Stories', href: '/stories' },
			{ label: 'Blog', href: '/blog' },
			{ label: 'Help Center', href: '/help' },
			{ label: 'Contact Support', href: '/support' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'About', href: '/about' },
			{ label: 'Careers', href: '/careers' },
			{ label: 'Newsroom', href: '/news' },
			{ label: 'Contact Sales', href: '/contact' },
		],
	},
];

const legalLinks: FooterLink[] = [
	{ label: 'Privacy & Terms', href: '/privacy' },
	{ label: 'Cookie Settings', href: '/cookies' },
	{ label: 'Legal Notice', href: '/legal' },
	{ label: 'Sitemap', href: '/sitemap' },
];

const socialLinks = [
	{
		name: 'Twitter',
		href: 'https://twitter.com',
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
			</svg>
		),
	},
	{
		name: 'LinkedIn',
		href: 'https://linkedin.com',
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
			</svg>
		),
	},
	{
		name: 'GitHub',
		href: 'https://github.com',
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-1.004-.013-1.845-2.757.626-3.338-1.169-3.338-1.169-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 6.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.624-5.373-12-12-12z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
];

export default function Footer() {
	return (
		<footer className="bg-black border-t border-cyan-400/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				{/* Main Footer Content */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
					{/* Logo Section */}
					<div className="col-span-2 md:col-span-3 lg:col-span-1">
						<Link
							href="/"
							className="flex items-baseline group cursor-pointer mb-4"
						>
							<h2 className="text-xl font-bold tracking-tighter font-source-code-pro">
								<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
									AFTER
								</span>
								<span className="text-white">-42</span>
							</h2>
							<Badge
								variant="outline"
								className="ml-2 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-[10px] px-1.5 py-0"
							>
								Beta
							</Badge>
						</Link>
						<p className="text-sm text-gray-400 mb-4">
							Hiring infrastructure to grow your team.
						</p>
						{/* Social Links */}
						<div className="flex items-center gap-4">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
									aria-label={social.name}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Footer Sections */}
					{footerSections.map((section) => (
						<div key={section.title}>
							<h3 className="text-sm font-semibold text-white mb-4">
								{section.title}
							</h3>
							<ul className="space-y-3">
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Section */}
				<div className="pt-8 border-t border-cyan-400/10">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						{/* Copyright */}
						<div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
							<p>&copy; 2025 After-42. All rights reserved.</p>
							<div className="flex items-center gap-4">
								{legalLinks.map((link, index) => (
									<Link
										key={link.href}
										href={link.href}
										className="hover:text-cyan-400 transition-colors duration-200"
									>
										{link.label}
									</Link>
								))}
							</div>
						</div>

						{/* Language/Region Selector (optional) */}
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<span>English</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
