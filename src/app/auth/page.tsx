import { AuthPanel } from '@/components/auth/AuthPanel';
import Link from 'next/link';

const Page = () => {
  return (
    <div className='relative min-h-screen flex flex-col bg-linear-to-br from-background via-muted/30 to-background dark:from-background dark:via-muted/10 dark:to-background'>
      {/* Subtle grid pattern overlay */}
      <div
        className='absolute inset-0 bg-[linear-gradient(to_right,var(--border)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--border)_0.5px,transparent_0.5px)] bg-size-[1.5rem_1.5rem] opacity-40 dark:opacity-20'
        aria-hidden
      />

      <header className='relative z-10 flex justify-center pt-12 pb-4'>
        <Link
          href='/'
          className='text-xl font-semibold tracking-tight text-foreground hover:text-foreground/80 transition-colors'
        >
          After-42
        </Link>
      </header>

      <main className='relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-8'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
            Welcome back
          </h1>
          <p className='mt-1.5 text-sm text-muted-foreground'>
            Sign in or create an account to continue
          </p>
        </div>
        <AuthPanel />
      </main>

      <footer className='relative z-10 py-6 text-center text-xs text-muted-foreground'>
        By continuing, you agree to our terms of service and privacy policy.
      </footer>
    </div>
  );
};

export default Page;
