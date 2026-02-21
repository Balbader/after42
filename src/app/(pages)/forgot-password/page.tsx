import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Header from '@/components/layout/navigation/Header';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
  title: 'Forgot Password | Oto',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <div className='container mx-auto flex flex-col items-center justify-center h-screen'>
        <ForgotPasswordForm />
      </div>
      <Footer />
    </>
  );
}
