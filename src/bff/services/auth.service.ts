import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/schemas/schema';
import { eq } from 'drizzle-orm';
import { User, type SignUpInput, type SignInInput } from '../models/user.model';
import { Session } from '../models/session.model';

function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error) return error.message || fallback;
	if (typeof error === 'string') return error || fallback;
	return fallback;
}

/**
 * AuthService handles all authentication operations via Better Auth
 * and manages user data in the database
 */
export class AuthService {
	/**
	 * Sign up a new user
	 */
	async signUp(
		input: SignUpInput,
		callbackURL: string = '/dashboard',
		headers?: Headers,
	) {
		try {
			const result = await auth.api.signUpEmail({
				body: {
					role: input.role as 'programmer' | 'recruiter',
					name: `${input.first_name} ${input.last_name}`,
					email: input.email,
					password: input.password,
					callbackURL,
					dateOfBirth: input.dateOfBirth,
					termsAcceptedAt: input.termsAcceptedAt,
					privacyPolicyAcceptedAt: input.privacyPolicyAcceptedAt,
				},
				...(headers && { headers }),
			});

			return {
				success: true,
				user: result.user ? User.fromDatabase(result.user) : null,
				// Session is managed via cookies by nextCookies() plugin
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: getErrorMessage(error, 'Sign up failed'),
			};
		}
	}

	/**
	 * Sign in an existing user
	 */
	async signIn(
		input: SignInInput,
		callbackURL: string = '/dashboard',
		headers?: Headers,
	) {
		try {
			const result = await auth.api.signInEmail({
				body: {
					email: input.email,
					password: input.password,
					callbackURL,
				},
				...(headers && { headers }),
			});

			// Update login count and last login
			if (result.user) {
				// await this.updateLoginMetadata(result.user.id);
			}

			return {
				success: true,
				user: result.user ? User.fromDatabase(result.user) : null,
				// Session is managed via cookies by nextCookies() plugin
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: getErrorMessage(error, 'Sign in failed'),
			};
		}
	}

	/**
	 * Sign out the current user
	 */
	async signOut(headers: Headers) {
		try {
			await auth.api.signOut({ headers });
			return { success: true };
		} catch (error: unknown) {
			return {
				success: false,
				error: getErrorMessage(error, 'Sign out failed'),
			};
		}
	}

	/**
	 * Get current session and user
	 */
	async getSession(headers: Headers) {
		try {
			const result = await auth.api.getSession({ headers });

			if (!result || !result.session) {
				return { success: false, session: null, user: null };
			}

			return {
				success: true,
				session: Session.fromDatabase(result.session),
				user: result.user ? User.fromDatabase(result.user) : null,
			};
		} catch (error: unknown) {
			return {
				success: false,
				error: getErrorMessage(error, 'Failed to get session'),
				session: null,
				user: null,
			};
		}
	}

	/**
	 * Get user by ID from database
	 */
	async getUserById(userId: string): Promise<User | null> {
		try {
			const [dbUser] = await db
				.select()
				.from(user)
				.where(eq(user.id, userId))
				.limit(1);

			return dbUser ? User.fromDatabase(dbUser) : null;
		} catch (error) {
			console.error('Failed to get user:', error);
			return null;
		}
	}
}

// Singleton instance
export const authService = new AuthService();
