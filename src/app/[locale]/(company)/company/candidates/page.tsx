'use client';

import { useTranslations } from 'next-intl';

import {
	RecruiterPage,
	RecruiterPageHeader,
	RecruiterPrimaryLink,
} from '@/components/company';
import { RecruiterCandidatesReview } from '@/components/company/recruiter-candidates-review';
import { UnifiedDashboardBanner } from '@/components/company/unified-dashboard-banner';

export default function AllCandidatesPage() {
	const t = useTranslations('company');

	return (
		<RecruiterPage>
			<UnifiedDashboardBanner tab='review' />
			<RecruiterPageHeader
				eyebrow={t('candidatesLabel')}
				title={t('candidatesTitle')}
				description={t('candidatesStandaloneLead')}
				actions={
					<RecruiterPrimaryLink href='/dashboard?tab=review'>
						{t('candidatesWorkspaceLink')}
					</RecruiterPrimaryLink>
				}
			/>
			<RecruiterCandidatesReview embedded={false} />
		</RecruiterPage>
	);
}
