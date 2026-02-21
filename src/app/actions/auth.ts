'use server';

/**
 * Server actions for authentication.
 * Now delegates to AuthController for clean separation of concerns and better testability.
 *
 * All business logic has been moved to the BFF layer:
 * - Validation: User model (Zod schemas)
 * - Business logic: AuthController
 * - External integrations: AuthService
 */

import { headers } from 'next/headers';
import { authController } from '@/bff/controllers/auth.controller';

/**
 * Sign up a new user
 */
export const signUpAction = async (formData: FormData) => {
  try {
    const result = await authController.signUp(formData);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

/**
 * Sign in an existing user
 */
export const signInAction = async (formData: FormData) => {
  try {
    const result = await authController.signIn(formData);
    return result;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

/**
 * Sign out the current user
 */
export const signOutAction = async () => {
  try {
    const result = await authController.signOut(await headers());
    return result;
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUserAction = async () => {
  return await authController.getCurrentUser(await headers());
};

/**
 * Get the current session with user
 */

export const getSessionAction = async () => {
  return await authController.getSession(await headers());
};

/**
 * Check if current user has a specific role
 */
export const checkUserRoleAction = async (role: string) => {
  // return await authController.checkUserRole(await headers(), role);
  return false;
};

/**
 * Check if current user is admin
 */
export const isAdminAction = async () => {
  // return await authController.isAdmin(await headers());
  return false;
};

/**
 * Check if current user can access admin panel
 */
export const canAccessAdminAction = async () => {
  // return await authController.canAccessAdmin(await headers());
  return false;
};
