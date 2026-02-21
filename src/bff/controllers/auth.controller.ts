import { authService } from '@/bff/services/auth.service';
import { SignUpSchema, SignInSchema } from '@/bff/models/user.model';
import { message, log } from '@/lib/log-helpers';
import { redirect } from 'next/navigation';

/**
 * AuthController orchestrates authentication business logic
 * Validates input, delegates to services, and handles responses
 */
export class AuthController {
  /**
   * Handle sign up request
   * @param headers - Request headers (from Next.js server action); required for nextCookies() to set session cookie
   */
  async signUp(formData: FormData, headers?: Headers) {
    message('AuthController: Processing sign up request');

    // Extract data from FormData
    const rawData = {
      role: formData.get('role') as 'programmer' | 'recruiter',
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      dateOfBirth: formData.get('dateOfBirth'),
      termsAcceptedAt: formData.get('termsAcceptedAt'),
      privacyPolicyAcceptedAt: formData.get('privacyPolicyAcceptedAt'),
    };

    // Validate with Zod
    const validation = SignUpSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      message(
        `AuthController: Sign up validation failed - ${firstError.message}`,
      );
      return {
        success: false,
        error: firstError.message,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Call service layer (pass headers so nextCookies() can set session cookie)
    const result = await authService.signUp(
      validation.data,
      '/dashboard',
      headers,
    );

    if (!result.success) {
      message(`AuthController: Sign up failed - ${result.error}`);
      return {
        success: false,
        error: result.error,
      };
    }

    message('AuthController: Sign up successful');
    return {
      success: true,
      user: result.user?.toJSON(),
    };
  }

  /**
   * Handle sign in request
   * @param headers - Request headers (from Next.js server action); required for nextCookies() to set session cookie
   */
  async signIn(formData: FormData, headers?: Headers) {
    message('AuthController: Processing sign in request');

    // Extract data from FormData
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Validate with Zod
    const validation = SignInSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      message(
        `AuthController: Sign in validation failed - ${firstError.message}`,
      );
      return {
        success: false,
        error: firstError.message,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Call service layer (pass headers so nextCookies() can set session cookie)
    const result = await authService.signIn(
      validation.data,
      '/dashboard',
      headers,
    );

    if (!result.success) {
      message(`AuthController: Sign in failed - ${result.error}`);
      return {
        success: false,
        error: result.error,
      };
    }

    message('AuthController: Sign in successful');
    return {
      success: true,
      user: result.user?.toJSON(),
    };
  }

  /**
   * Handle sign out request
   */
  async signOut(headers: Headers) {
    message('AuthController: Processing sign out request');

    const result = await authService.signOut(headers);

    if (!result.success) {
      message(`AuthController: Sign out failed - ${result.error}`);
      return {
        success: false,
        error: result.error,
      };
    }

    message('AuthController: Sign out successful');
    return {
      success: true,
    };
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(headers: Headers) {
    const result = await authService.getSession(headers);

    if (!result.success || !result.user) {
      return null;
    }

    return result.user;
  }

  /**
   * Get current session with user
   */
  async getSession(headers: Headers) {
    const result = await authService.getSession(headers);

    if (!result.success) {
      return {
        session: null,
        user: null,
      };
    }

    return {
      session: result.session,
      user: result.user,
    };
  }

  /**
   * Require an authenticated session or redirect to home.
   * Use in server components/pages that must be protected.
   * Never returns when unauthenticated (redirects instead).
   */
  async requireSession(headers: Headers) {
    const { session, user } = await this.getSession(headers);
    if (!session) {
      log('No session (requireSession)', 'error');
      redirect('/');
    }
    return { session, user };
  }

  /**
   * Check if user has specific role
   */
  // async checkUserRole(headers: Headers, role: string): Promise<boolean> {
  //   const user = await this.getCurrentUser(headers);
  //   return user ? user.hasRole(role) : false;
  // }

  /**
   * Check if user is admin
   */
  // async isAdmin(headers: Headers): Promise<boolean> {
  //   const user = await this.getCurrentUser(headers);
  //   return user ? user.isAdminUser() : false;
  // }

  /**
   * Check if user is founder
   */
  // async isFounder(headers: Headers): Promise<boolean> {
  //   const user = await this.getCurrentUser(headers);
  //   return user ? user.isFounderUser() : false;
  // }

  /**
   * Check if user can access admin panel
   */
  // async canAccessAdmin(headers: Headers): Promise<boolean> {
  //   const user = await this.getCurrentUser(headers);
  //   return user ? user.canAccessAdminPanel() : false;
  // }

  /**
   * Update user role (admin only)
   */
  // async updateRole(
  //   headers: Headers,
  //   targetUserId: string,
  //   newRole: string,
  // ): Promise<{ success: boolean; error?: string }> {
  //   // Check if current user is admin
  //   const isAdmin = await this.isAdmin(headers);
  //   if (!isAdmin) {
  //     return {
  //       success: false,
  //       error: 'Unauthorized: Admin access required',
  //     };
  //   }

  // const success = await authService.updateUserRole(targetUserId, newRole);
  // const success = true;
  // return {
  //   success,
  //   error: success ? undefined : 'Failed to update user role',
  // };
}

// Singleton instance
export const authController = new AuthController();
