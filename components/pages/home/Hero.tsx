'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
	return (
		<section className="relative min-h-screen overflow-hidden bg-black">
			{/* Professional Background Pattern */}
			<div className="absolute inset-0">
				{/* Subtle grid pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

				{/* Subtle gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>

				{/* Professional accent lines */}
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
				<div className="absolute top-20 left-0 w-1/3 h-px bg-gradient-to-r from-cyan-500/10 to-transparent"></div>
				<div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-cyan-500/10 to-transparent"></div>
			</div>

			{/* Content Container */}
			<div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto w-full text-center">
					{/* Badge */}
					<div className="flex justify-center mb-8">
						<Badge
							variant="outline"
							className="border-cyan-400/30 text-cyan-400/90 bg-cyan-400/5 text-xs px-4 py-1.5 backdrop-blur-sm hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-colors duration-200 font-medium"
						>
							AI-Powered Hiring Platform
						</Badge>
					</div>

					{/* Main Title */}
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight">
						<span className="text-white block mb-2">
							DISCOVER AND HIRE
						</span>
						<span className="block">
							<span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
								THE BEST
							</span>
							<span className="text-white ml-2">
								42 DEVELOPERS
							</span>
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
						No more endless CVs. No more wasted interviews. No more
						bad hires.
						<br className="hidden sm:block" />
						<span className="block sm:inline mt-2 sm:mt-0">
							<span className="text-white font-medium">
								Just verified talent that fits your needs{' '}
							</span>
							<span className="text-cyan-400/90 font-bold">
								perfectly
							</span>
							<span className="text-white">.</span>
						</span>
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 w-full">
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto border-cyan-400/30 text-cyan-400/90 bg-cyan-400/5 hover:bg-cyan-400/10 hover:border-cyan-400/50 hover:text-cyan-300 transition-all duration-200 backdrop-blur-sm px-8 h-12 text-sm font-medium"
						>
							Learn More
						</Button>
						<Link href="/dashboard" className="w-full sm:w-auto">
							<Button
								size="lg"
								className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:from-cyan-300 hover:to-cyan-400 border-0 font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 px-8 h-12 text-sm"
							>
								Get Started
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
		</section>
	);
}
