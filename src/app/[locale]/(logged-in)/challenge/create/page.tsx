import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { JobPostUploader } from '@/components/job-post/job-post-uploader';
import { RecruiterCard, RecruiterPage, RecruiterPageHeader } from '@/components/company';
import { requireRole } from '@/lib/require-role';

export const metadata: Metadata = {
	title: 'Create Challenge | after42',
	description: 'Upload a job post to generate a coding challenge',
};

type PageProps = { params: Promise<{ locale: string }> };

export default async function CreateChallengePage({ params }: PageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations('company');

	await requireRole('recruiter');

	return (
		<RecruiterPage>
			<RecruiterPageHeader
				eyebrow={t('createFlowEyebrow')}
				title={t('createFlowTitle')}
				description={t('createFlowLead')}
			/>

			<RecruiterCard className='mt-8 max-w-3xl'>
				<JobPostUploader embedded />
			</RecruiterCard>
		</RecruiterPage>
	);
}
