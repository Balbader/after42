
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { message } from '@/lib/print-helpers';

/**
 * Proxy for protecting routes with authentication
 *
 * Protected routes require a valid session. Unauthenticated users are redirected to /auth.
 * Public routes are accessible to all users without authentication.
 *
 * Note: Next.js 16 renamed middleware to proxy. The proxy runs on Node.js runtime
 * (not Edge Runtime), which allows Better Auth to properly access the database.
 */

// Routes that require authentication
const protectedRoutes = ['/chat', '/dashboard'];

// Routes accessible without authentication
const publicRoutes = ['/auth', '/', '/api/auth'];

/**
 * Proxy function - protects routes based on authentication
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  message(`Proxy: Processing request for ${pathname}`);

  // Allow public routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  if (isPublicRoute) {
    message(`Proxy: Public route ${pathname} - allowing access`);
    return NextResponse.next();
  }

  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    message(`Proxy: Unprotected route ${pathname} - allowing access`);
    return NextResponse.next();
  }

  // Get session for protected routes
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Redirect to auth if no session
    if (!session || !session.session) {
      message(`Proxy: No session for ${pathname} - redirecting to /auth`);
      const url = new URL('/auth', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Allow access if session is valid
    message(`Proxy: Valid session for ${pathname} - allowing access`);
    return NextResponse.next();
  } catch (error) {
    console.error('Proxy auth check failed:', error);
    message(
      `Proxy: Auth check error for ${pathname} - redirecting to /auth`,
    );

    // Redirect to auth on error
    const url = new URL('/auth', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
}

/**
 * Configure which routes the proxy should run on
 *
 * Excludes:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico
 * - public files with extensions
 * - api/auth/* (Better Auth endpoints)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.* with extension (public files)
     * - api/auth (Better Auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
};
