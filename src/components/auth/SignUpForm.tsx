'use client';

import { useForm } from '@tanstack/react-form-nextjs';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';

import Link from 'next/link';

import { signUpAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { log } from '@/lib/log-helpers';
import { cn } from '@/lib/utils';

const formSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    dateOfBirth: z.number().min(1, 'Date of birth is required'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message:
        'You must accept the terms and conditions and the privacy policy',
    }),
  })
  .required();

export function SignUpForm() {
  const form = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      dateOfBirth: 0,
      termsAccepted: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const timestamp = Date.now();
      const formData = new FormData();
      formData.append('first_name', value.first_name);
      formData.append('last_name', value.last_name);
      formData.append('email', value.email);
      formData.append('password', value.password);
      formData.append('dateOfBirth', value.dateOfBirth.toString());
      formData.append('termsAcceptedAt', timestamp.toString());
      formData.append('privacyPolicyAcceptedAt', timestamp.toString());
      log('Submitting form with values:', value);

      // Call server action
      try {
        const result = await signUpAction(formData);

        if (!result.success) {
          toast.error('Sign up failed', {
            description: result.error || 'Please try again later',
          });
        } else {
          toast.success('Account created!', {
            description: 'Your registration has been completed.',
          });
        }
      } catch (error) {
        log('Sign up error:', error);
        toast.error('An error occurred', {
          description: 'Please try again later',
        });
      }
    },
  });

  return (
    <Card className='w-full sm:max-w-md'>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='signup-form'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name='first_name'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='John'
                      autoComplete='given-name'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name='last_name'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Doe'
                      autoComplete='family-name'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name='email'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='john.doe@example.com'
                      autoComplete='email'
                      type='email'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name='password'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type='password'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='********'
                      autoComplete='new-password'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name='dateOfBirth'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const selectedDate = field.state.value
                  ? new Date(field.state.value)
                  : undefined;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Date of birth</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.state.value && 'text-muted-foreground',
                          )}
                          aria-invalid={isInvalid}
                        >
                          <CalendarIcon className='mr-2 size-4 shrink-0' />
                          {field.state.value
                            ? format(selectedDate!, 'PPP')
                            : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align='start' className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          captionLayout='dropdown'
                          selected={selectedDate}
                          onSelect={(date) =>
                            field.handleChange(date ? date.getTime() : 0)
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name='termsAccepted'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field
                    data-invalid={isInvalid}
                    orientation='horizontal'
                    className='items-start'
                  >
                    <div className='flex items-start gap-3'>
                      <Checkbox
                        id={field.name}
                        checked={field.state.value === true}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                      />
                      <div className='text-balance'>
                        <FieldLabel
                          htmlFor={field.name}
                          className='cursor-pointer font-normal text-sm text-muted-foreground'
                        >
                          <div>
                            I accept the{' '}
                            <Link
                              href='/terms'
                              className='underline underline-offset-4 hover:text-primary'
                            >
                              terms of use
                            </Link>{' '}
                            and the{' '}
                            <Link
                              href='/privacy'
                              className='underline underline-offset-4 hover:text-primary'
                            >
                              privacy policy
                            </Link>
                          </div>
                        </FieldLabel>
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </div>
                    </div>
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col gap-4'>
        <Field
          orientation='horizontal'
          className='flex flex-row justify-center gap-4 mx-auto mt-4'
        >
          <Button type='button' variant='outline' onClick={() => form.reset()}>
            Clear
          </Button>
          <Button
            type='submit'
            form='signup-form'
            disabled={form.state.isSubmitting}
            className='w-1/3'
          >
            {form.state.isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        </Field>
        <p className='text-center text-xs text-muted-foreground mt-4'>
          Already have an account?{' '}
          <Link
            href='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Sign in here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
