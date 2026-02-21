/**
 * Client-side Better Auth instance for React. Used by components and hooks to
 * perform sign-in, sign-up, sign-out, and session checks. Configured with the
 * app base URL so requests hit the Better Auth API handler at /api/auth/[...all].
 */
import {
  lastLoginMethodClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [lastLoginMethodClient(), organizationClient()],
});
