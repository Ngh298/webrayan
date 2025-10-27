import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(req => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Protected routes
  const protectedRoutes = ['/admin', '/dashboard', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Redirect to signin if not authenticated
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons|fonts|manifest.json|robots.txt).*)',
  ],
};
