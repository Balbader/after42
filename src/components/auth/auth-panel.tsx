'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from '@/components/auth/sign-in-form';
import { SignUpForm } from '@/components/auth/sign-up-form';

export function AuthPanel() {
	return (
		<div className='w-full max-w-md'>
			<Tabs defaultValue='signin' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 mb-6'>
					<TabsTrigger value='signin'>Sign In</TabsTrigger>
					<TabsTrigger value='signup'>Sign Up</TabsTrigger>
				</TabsList>
				<TabsContent value='signin'>
					<SignInForm />
				</TabsContent>
				<TabsContent value='signup'>
					<SignUpForm />
				</TabsContent>
			</Tabs>
		</div>
	);
}
