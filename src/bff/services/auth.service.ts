import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable } from '../../../auth-schema';
import { eq } from 'drizzle-orm';
import {
  User,
  type SignUpInput,
  type SignInInput,
} from '@/bff/models/user.model';
import { Session } from '@/bff/models/session.model';

/**
 * AuthService handles all authentication operations via Better Auth
 * and manages user data in the database
 */
export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(input: SignUpInput, callbackURL: string = '/yes') {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: `${input.first_name} ${input.last_name}`,
          email: input.email,
          password: input.password,
          callbackURL,
        },
      });

      return {
        success: true,
        user: result.user ? User.fromDatabase(result.user) : null,
        // Session is managed via cookies by nextCookies() plugin
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed',
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(input: SignInInput, callbackURL: string = '/yes') {
    try {
      const result = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
          callbackURL,
        },
      });

      // Update login count and last login
      if (result.user) {
        await this.updateLoginMetadata(result.user.id);
      }

      return {
        success: true,
        user: result.user ? User.fromDatabase(result.user) : null,
        // Session is managed via cookies by nextCookies() plugin
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign in failed',
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign out failed',
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get session',
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
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      return dbUser ? User.fromDatabase(dbUser) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Update user login metadata (login count and last login timestamp)
   */
  private async updateLoginMetadata(userId: string) {
    try {
      const user = await this.getUserById(userId);
      if (user) {
        await db
          .update(userTable)
          .set({
            loginCount: user.loginCount + 1,
            lastLogin: new Date(),
          })
          .where(eq(userTable.id, userId));
      }
    } catch (error) {
      console.error('Failed to update login metadata:', error);
    }
  }

  /**
   * Update user role
   */
updateUserRole(userId: string, role: string): Promise<boolean> {
    try {
      await db.update(userTable).set({ role }).where(eq(userTable.id, userId));
      return true;
    } catch (error) {
      console.error('Failed to update user role:', error);
      return false;
    }
  }

  /**
   * Update user admin status
   */
  async updateAdminStatus(userId: string, isAdmin: boolean): Promise<boolean> {
    try {
      await db
        .update(userTable)
        .set({ isAdmin })
        .where(eq(userTable.id, userId));
      return true;
    } catch (error) {
      console.error('Failed to update admin status:', error);
      return false;
    }
  }

  /**
   * Update user founder status
   */
  async updateFounderStatus(
    userId: string,
    isFounder: boolean,
  ): Promise<boolean> {
    try {
      await db
        .update(userTable)
        .set({ isFounder })
        .where(eq(userTable.id, userId));
      return true;
    } catch (error) {
      console.error('Failed to update founder status:', error);
      return false;
    }
  }
}

// Singleton instance
export const authService = new AuthService();
