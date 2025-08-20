// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getSessionAndResponse } from '@/utils/supabase/middleware';

const AUTH_ROUTES = ['/signin', '/signup', '/email-verify'];
const PROTECTED_ROUTES = ['/', '/account'];

export async function middleware(request: NextRequest) {
  const { response, user } = await getSessionAndResponse(request);
  const url = new URL(request.url);
  const path = url.pathname;

  const isAuthed = !!user;

  // Protect private routes
  if (PROTECTED_ROUTES.some((p) => path === p || path.startsWith(p + '/'))) {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Keep authed users out of guest-only routes
  if (AUTH_ROUTES.some((p) => path === p || path.startsWith(p + '/'))) {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Default: continue with the (possibly cookie-refreshed) response
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
