import type { Metadata } from 'next';
import {
	DM_Sans,
	Fraunces,
	Geist,
	Geist_Mono,
	JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const dmSans = DM_Sans({
	variable: '--font-dm-sans',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	style: ['normal', 'italic'],
});

const fraunces = Fraunces({
	variable: '--font-fraunces',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600'],
	style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
	weight: ['400', '500'],
});

export const metadata: Metadata = {
	title: 'AFTER-42',
	description: 'Hire the best devs from the 42 network',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
