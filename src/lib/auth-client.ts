/**
 * Client-side Better Auth instance for React. Used by components and hooks to
 * perform sign-in, sign-up, sign-out, and session checks. Configured with the
 * app base URL so requests hit the Better Auth API handler at /api/auth/[...all].
 *
 * When NEXT_PUBLIC_API_URL is unset, we use the current origin so useSession()
 * and other client calls hit the same Next.js app where the session cookie is set.
 */
import {
  lastLoginMethodClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

function getBaseURL(): string | undefined {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return undefined;
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [lastLoginMethodClient(), organizationClient()],
});
