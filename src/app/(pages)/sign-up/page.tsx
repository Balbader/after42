import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/SignUpForm';
import Header from '@/components/layout/navigation/Header';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
  title: 'Sign Up | Oto',
  description: 'Create your account',
};

export default function Page() {
  return (
    <>
      <Header />
      <section className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8'>
        <SignUpForm />
      </section>
      <Footer />
    </>
  );
}
