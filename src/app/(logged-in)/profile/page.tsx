import type { Metadata } from 'next';
import PatientProfile from '@/components/patient/PatientProfile';

export const metadata: Metadata = {
  title: 'Profile | Oto',
  description: 'Manage your profile',
};

export default function Page() {
  return (
    <div className='flex flex-col gap-4'>
      <PatientProfile />
    </div>
  );
}
