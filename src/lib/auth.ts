/**
 * better-auth instance: handles sign-in, sign-up, sessions, and OAuth.
 * Uses the Drizzle adapter with SQLite and the auth schema (user, session, account, verification).
 */
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { Resend } from 'resend';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import VerifyEmail from '@/emails/verify-email';
import ForgotPasswordEmail from '@/emails/reset-password';

/** Params Better Auth passes to custom email senders */
type AuthEmailCallbackParams = {
	user: { email: string; name: string };
	url: string;
};

export const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	emailVerification: {
		sendVerificationEmail: async ({ user, url }: AuthEmailCallbackParams) => {
			await resend.emails.send({
				from: 'basil@after42.ai',
				to: user.email,
				subject: 'Verify your email address',
				react: VerifyEmail({ username: user.name, verifyUrl: url }),
			});
		},
		sendOnSignUp: true, // send verification email on sign up
	},
	emailAndPassword: {
		enabled: true, // enable email and password authentication
		// autoSignIn: false, // don't auto sign in after sign up
		sendResetPassword: async ({ user, url }: AuthEmailCallbackParams) => {
			await resend.emails.send({
				from: 'basil@after42.ai',
				to: user.email,
				subject: 'Reset your password',
				react: ForgotPasswordEmail({
					username: user.name,
					resetUrl: url,
					userEmail: user.email,
				}),
			});
		},
		requireEmailVerification: true,
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: true,
				defaultValue: 'patient',
			},
			dateOfBirth: {
				type: 'number',
				required: true,
			},
			termsAcceptedAt: {
				type: 'number',
				required: true,
			},
			privacyPolicyAcceptedAt: {
				type: 'number',
				required: true,
			},
		},
	},
	plugins: [nextCookies()], // set server action cookies
});
