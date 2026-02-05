'use client';

import { useForm } from '@tanstack/react-form-nextjs';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { log } from '@/lib/print-helpers';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const SignInForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmitInvalid: ({ value }) => {
      toast.error('Invalid form data', {
        description: 'Please check your input',
      });
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append('email', value.email);
      formData.append('password', value.password);
      log('Submitting form with values:', value);
    },
  });
  return (
    <div>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id='signin-form'
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name='email'
                children={(field) => {
                  return (
                    <FieldGroup>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type='email'
                        name='email'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FieldGroup>
                  );
                }}
              />
            </FieldGroup>
            <FieldGroup>
              <form.Field
                name='password'
                children={(field) => {
                  return (
                    <FieldGroup className='pt-4 pb-4 border-none'>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        type='password'
                        name='password'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </FieldGroup>
                  );
                }}
              />
            </FieldGroup>
            <FieldGroup>
              <Button type='submit' form='signin-form'>
                Sign In
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
