import type { Metadata } from 'next';
import Header from '@/components/layout/navigation/Header';
import Footer from '@/components/layout/navigation/Footer';

export const metadata: Metadata = {
  title: 'AFTER-42 | Pages',
  description: 'Hire the best devs from the 42 network',
};

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
