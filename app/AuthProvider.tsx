'use client';

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { ReactNode } from 'react';
import { KindeErrorBoundaryWrapper } from './KindeErrorBoundary';

interface AuthProviderProps {
	children: ReactNode;
}

/**
 * AuthProvider wraps the app with Kinde authentication.
 * If Kinde environment variables are not configured, the error boundary
 * will catch the error and render children without the provider.
 *
 * Required environment variables:
 * - KINDE_SITE_URL (or NEXT_PUBLIC_KINDE_SITE_URL)
 * - KINDE_ISSUER_URL (or NEXT_PUBLIC_KINDE_ISSUER_URL)
 * - KINDE_CLIENT_ID
 * - KINDE_CLIENT_SECRET
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
	return (
		<KindeErrorBoundaryWrapper>
			<KindeProvider>{children}</KindeProvider>
		</KindeErrorBoundaryWrapper>
	);
};
