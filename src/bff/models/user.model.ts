import { z } from 'zod';

// Validation schemas
export const SignUpSchema = z.object({
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
  ) {}

  /**
   * Factory method to create User from database row
   */
  static fromDatabase(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.name,
      dbUser.email,
      dbUser.role,
      dbUser.dateOfBirth,
      dbUser.termsAcceptedAt,
      dbUser.privacyPolicyAcceptedAt,
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
    };
  }
}
