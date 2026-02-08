import { z } from 'zod';

// Validation schemas
export const SignUpSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
    public isAdmin: boolean = false,
    public isFounder: boolean = false,
    public loginCount: number = 0,
    public lastLogin?: Date,
  ) {}

  // Business logic methods
  public hasRole(role: string): boolean {
    return this.role === role;
  }

  public isAdminUser(): boolean {
    return this.isAdmin === true;
  }

  public isFounderUser(): boolean {
    return this.isFounder === true;
  }

  public canAccessAdminPanel(): boolean {
    return this.isAdmin || this.isFounder;
  }

  public incrementLoginCount(): void {
    this.loginCount += 1;
    this.lastLogin = new Date();
  }

  /**
   * Factory method to create User from database row
   */
  static fromDatabase(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.name,
      dbUser.email,
      dbUser.role || 'founder',
      dbUser.isAdmin || false,
      dbUser.isFounder || false,
      dbUser.loginCount || 0,
      dbUser.lastLogin ? new Date(dbUser.lastLogin) : undefined,
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
      isAdmin: this.isAdmin,
      isFounder: this.isFounder,
      loginCount: this.loginCount,
      lastLogin: this.lastLogin?.toISOString(),
    };
  }
}
