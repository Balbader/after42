import { headers } from 'next/headers';
import { format } from 'date-fns';

import { authController } from '@/bff/controllers/auth.controller';
import type { User } from '@/bff/models/user.model';
import { SectionLabel, SectionTitle } from '@/components/company/ui';

export default async function ProfilePage() {
	const { user } = await authController.requireSession(await headers());
	const u = user as User;

	const memberSince = u.createdAt
		? format(new Date(u.createdAt), 'MMMM yyyy')
		: '—';

	return (
		<div className='mx-auto w-full max-w-2xl px-4 pt-8'>
			<SectionLabel>Profile</SectionLabel>
			<SectionTitle className='mt-2'>Your profile</SectionTitle>

			<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
				<dl className='space-y-4'>
					<ProfileField label='Name' value={u.name} />
					<ProfileField label='Email' value={u.email} />
					<ProfileField
						label='Role'
						value={u.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
					/>
					<ProfileField label='Member since' value={memberSince} />
				</dl>
			</div>
		</div>
	);
}

function ProfileField({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className='font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
				{label}
			</dt>
			<dd className='mt-0.5 font-(family-name:--font-dm-sans) text-sm text-[#1C1917]'>
				{value}
			</dd>
		</div>
	);
}
