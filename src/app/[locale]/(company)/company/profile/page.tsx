import { requireRole } from '@/lib/require-role';
import { SectionLabel, SectionTitle } from '@/components/company/ui';

export default async function CompanyProfilePage() {
	await requireRole('recruiter');

	return (
		<div className='mx-auto w-full max-w-2xl px-4 pt-8'>
			<SectionLabel>Company</SectionLabel>
			<SectionTitle className='mt-2'>Company profile</SectionTitle>
			<p className='mt-1 font-(family-name:--font-dm-sans) text-sm text-[#78716C]'>
				Manage your company information visible to candidates.
			</p>

			<div className='mt-8 rounded-lg border border-[#E7E5E4] bg-[#FFFFFF] p-6'>
				<form className='space-y-5'>
					<div>
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
							Company name
						</label>
						<input
							type='text'
							className='w-full rounded-md border border-[#D6D3D1] bg-[#FFFFFF] px-3 py-2 font-(family-name:--font-dm-sans) text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:border-[#C2410C] focus-visible:outline-none'
							placeholder='e.g. TechCorp'
						/>
					</div>
					<div>
						<label className='mb-1.5 block font-(family-name:--font-dm-sans) text-[11px] font-semibold tracking-[0.06em] text-[#A8A29E] uppercase'>
							Description
						</label>
						<textarea
							rows={4}
							className='w-full rounded-md border border-[#D6D3D1] bg-[#FFFFFF] px-3 py-2 font-(family-name:--font-dm-sans) text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:border-[#C2410C] focus-visible:outline-none'
							placeholder='Tell candidates what your company does...'
						/>
					</div>
					<button
						type='submit'
						disabled
						className='rounded-md bg-[#C2410C] px-6 py-2.5 font-(family-name:--font-dm-sans) text-sm font-medium text-white transition-colors hover:bg-[#9A3412] disabled:opacity-40'
					>
						Save changes
					</button>
					<p className='font-(family-name:--font-dm-sans) text-xs text-[#A8A29E]'>
						Company profile editing coming soon.
					</p>
				</form>
			</div>
		</div>
	);
}
