import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';

export const metadata: Metadata = {
	title: 'Challenges | after42',
	description: 'View and manage your coding challenges',
};

export default async function ChallengesDashboardPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	redirect({ href: '/dashboard?tab=pipeline', locale });
}
