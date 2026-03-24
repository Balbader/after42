import type { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

import { user as userTable } from '@/db/schemas/schema';

type UserRow = InferSelectModel<typeof userTable>;

/** Drizzle row and/or Better Auth user payload */
type UserSource = Pick<
	UserRow,
	| 'id'
	| 'name'
	| 'email'
	| 'role'
	| 'dateOfBirth'
	| 'termsAcceptedAt'
	| 'privacyPolicyAcceptedAt'
> & {
	avatar?: string | null;
	/** Better Auth default field for profile photo URL */
	image?: string | null;
};

// Validation schemas
export const SignUpSchema = z.object({
	role: z.enum(['programmer', 'recruiter']),
	first_name: z.string().min(1, 'First name is required'),
	last_name: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	dateOfBirth: z.coerce.number().min(1, 'Date of birth is required'),
	termsAcceptedAt: z.coerce
		.number()
		.min(1, 'Terms acceptance timestamp is required'),
	privacyPolicyAcceptedAt: z.coerce
		.number()
		.min(1, 'Privacy policy acceptance timestamp is required'),
});

export const SignInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignInInput = z.infer<typeof SignInSchema>;

/**
 * User domain model with business logic
 */
export class User {
	constructor(
		public id: string,
		public name: string,
		public email: string,
		public role: string,
		public dateOfBirth: number,
		public termsAcceptedAt: number,
		public privacyPolicyAcceptedAt: number,
		public avatar: string,
	) { }

	/**
	 * Factory method to create User from database row
	 */
	static fromDatabase(dbUser: UserSource): User {
		const avatar = dbUser.avatar ?? dbUser.image ?? '';
		return new User(
			dbUser.id,
			dbUser.name,
			dbUser.email,
			dbUser.role,
			dbUser.dateOfBirth,
			dbUser.termsAcceptedAt,
			dbUser.privacyPolicyAcceptedAt,
			avatar,
		);
	}

	/**
	 * Convert to plain object for serialization
	 */
	toJSON() {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			role: this.role,
			dateOfBirth: this.dateOfBirth,
			termsAcceptedAt: this.termsAcceptedAt,
			privacyPolicyAcceptedAt: this.privacyPolicyAcceptedAt,
			avatar: this.avatar,
		};
	}
}
