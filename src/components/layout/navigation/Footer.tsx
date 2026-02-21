import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-background border-t border-border bottom-0 z-50 w-full'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-2'>
          <Link
            href='/'
            className='flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
          >
            <Image
              src='/logo/after42-logo.png'
              alt='After42'
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>
        <p className='text-sm text-muted-foreground'>
          &copy; 2026 After42. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
