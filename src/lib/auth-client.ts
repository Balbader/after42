/**
 * Client-side Better Auth instance for React. Used by components and hooks to
 * perform sign-in, sign-up, sign-out, and session checks. Configured with the
 * app base URL so requests hit the Better Auth API handler at /api/auth/[...all].
 *
 * Uses lazy init so baseURL is set at request time in the browser (window.location.origin),
 * avoiding "Failed to fetch" when the module was first evaluated with an invalid baseURL.
 */
import {
  lastLoginMethodClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

function getBaseURL(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}

let _authClient: ReturnType<typeof createAuthClient> | null = null;

function getAuthClient() {
  if (!_authClient) {
    const baseURL = getBaseURL();
    _authClient = createAuthClient({
      baseURL: baseURL || undefined,
      plugins: [lastLoginMethodClient(), organizationClient()],
    });
  }
  return _authClient;
}

export const authClient = new Proxy({} as ReturnType<typeof createAuthClient>, {
  get(_, prop) {
    return getAuthClient()[prop as keyof ReturnType<typeof createAuthClient>];
  },
});
