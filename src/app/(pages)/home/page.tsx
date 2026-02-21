import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Sparkles,
  Code2,
  Target,
  GraduationCap,
  Scale,
} from 'lucide-react';

export default function Home() {
  return (
    <main className='flex flex-col'>
      {/* Hero */}
      <section
        className='relative overflow-hidden border-b border-border bg-linear-to-b from-muted/30 to-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36'
        aria-labelledby='hero-heading'
      >
        <div className='container mx-auto max-w-4xl text-center'>
          <Badge variant='secondary' className='mb-6 font-medium'>
            For the 42 network
          </Badge>
          <h1
            id='hero-heading'
            className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'
          >
            <span className='bg-linear-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent'>
              Skills, not CVs.
            </span>
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl'>
            The hiring marketplace built exclusively for 42 students. Prove what
            you can do with custom technical challenges — and let companies hire
            on proof, not paperwork.
          </p>
          <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
            <Button asChild size='lg' className='min-w-[160px]'>
              <Link href='/sign-up'>Join as a student</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='min-w-[160px]'
            >
              <Link href='/sign-in'>I&apos;m a company</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section
        className='border-b border-border px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='problem-heading'
      >
        <div className='container mx-auto max-w-3xl text-center'>
          <h2
            id='problem-heading'
            className='text-2xl font-semibold sm:text-3xl'
          >
            Résumés don&apos;t measure skill
          </h2>
          <p className='mt-4 text-muted-foreground'>
            In the 42 network, students often come from unconventional paths.
            Traditional recruiting overlooks that talent. After42 changes that.
          </p>
          <p className='mt-6 text-lg font-medium text-foreground'>
            Think of it as &ldquo;LinkedIn meets HackerRank&rdquo; — built by
            and for the 42 ecosystem.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        className='border-b border-border bg-muted/20 px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='how-heading'
      >
        <div className='container mx-auto max-w-5xl'>
          <h2
            id='how-heading'
            className='text-center text-2xl font-semibold sm:text-3xl'
          >
            How it works
          </h2>
          <p className='mx-auto mt-2 max-w-2xl text-center text-muted-foreground'>
            Three steps from job post to proven fit.
          </p>
          <ul className='mt-12 grid gap-6 sm:grid-cols-3'>
            <li>
              <Card className='h-full border-border'>
                <CardHeader>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Briefcase className='size-5' aria-hidden />
                  </div>
                  <CardTitle className='text-lg'>
                    Company posts a role
                  </CardTitle>
                  <CardDescription>
                    A company publishes a job offer with stack, difficulty, and
                    deliverables.
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
            <li>
              <Card className='h-full border-border'>
                <CardHeader>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Sparkles className='size-5' aria-hidden />
                  </div>
                  <CardTitle className='text-lg'>
                    AI builds the challenge
                  </CardTitle>
                  <CardDescription>
                    Our agent turns the offer into a custom technical challenge
                    aligned with the role.
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
            <li>
              <Card className='h-full border-border'>
                <CardHeader>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Code2 className='size-5' aria-hidden />
                  </div>
                  <CardTitle className='text-lg'>Students prove it</CardTitle>
                  <CardDescription>
                    Students complete the challenge. Companies get proof of
                    skill with detailed evaluation rubrics — not just a CV.
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          </ul>
        </div>
      </section>

      {/* For Companies / For Students */}
      <section
        className='border-b border-border px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='value-heading'
      >
        <div className='container mx-auto max-w-5xl'>
          <h2
            id='value-heading'
            className='text-center text-2xl font-semibold sm:text-3xl'
          >
            Built for both sides
          </h2>
          <div className='mt-12 grid gap-8 md:grid-cols-2'>
            <Card className='border-border'>
              <CardHeader>
                <div className='flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400'>
                  <Target className='size-5' aria-hidden />
                </div>
                <CardTitle>For companies</CardTitle>
                <CardDescription>
                  Faster hiring, higher confidence, and direct access to elite
                  42 talent. Evaluate on real work, not pedigree.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className='border-border'>
              <CardHeader>
                <div className='flex size-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400'>
                  <GraduationCap className='size-5' aria-hidden />
                </div>
                <CardTitle>For students</CardTitle>
                <CardDescription>
                  A fair, transparent way to prove yourself — regardless of
                  background, age, or experience. Your skills speak.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section
        className='border-b border-border bg-muted/20 px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='vision-heading'
      >
        <div className='container mx-auto max-w-3xl text-center'>
          <div className='flex justify-center text-muted-foreground'>
            <Scale className='size-12' aria-hidden />
          </div>
          <h2
            id='vision-heading'
            className='mt-4 text-2xl font-semibold sm:text-3xl'
          >
            Skills as the true currency of hiring
          </h2>
          <p className='mt-4 text-muted-foreground'>
            We focus opportunities on talent — not age, background, experience,
            culture, or gender. After42 is where the 42 network meets the market
            on proof.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className='px-4 py-16 sm:px-6 lg:px-8'
        aria-labelledby='cta-heading'
      >
        <div className='container mx-auto max-w-2xl text-center'>
          <h2 id='cta-heading' className='text-2xl font-semibold sm:text-3xl'>
            Ready to put skills first?
          </h2>
          <p className='mt-2 text-muted-foreground'>
            Join as a 42 student or get in touch if you&apos;re hiring.
          </p>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
            <Button asChild size='lg'>
              <Link href='/sign-up'>Get started</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/sign-in'>Sign in</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
