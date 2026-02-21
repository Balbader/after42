import Link from 'next/link';
import Image from 'next/image';
import after42Logo from '../../../../public/binary-code.png';

export default function Header() {
  return (
    // Sticky header with backdrop blur
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Main Navigation */}
        <nav
          className='flex w-full items-center justify-between gap-2'
          aria-label='Main navigation'
        >
          {/* Left: Logo */}
          <div className='flex items-center gap-2'>
            <Link
              href='/'
              className='flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
            >
              <Image
                src={after42Logo}
                alt='After42'
                width={100}
                height={100}
                priority
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
