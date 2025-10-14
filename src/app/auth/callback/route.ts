// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ACCOUNT, SIGN_IN } from '@/routes/routes';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const errParam =
    url.searchParams.get('error') ||
    url.searchParams.get('error_code') ||
    undefined;
  const errDesc = url.searchParams.get('error_description') || undefined;

  const SIGNIN_PATH = `/${SIGN_IN.replace(/^\//, '')}`;
  const DEFAULT_NEXT = `/${ACCOUNT.replace(/^\//, '')}`;

  const rawNext = url.searchParams.get('next');
  const next = rawNext && rawNext.startsWith('/') ? rawNext : DEFAULT_NEXT;

  if (errParam) {
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_SITE_URL
      }${SIGNIN_PATH}?error=${encodeURIComponent(errDesc || errParam)}`
    );
  }
  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${SIGNIN_PATH}?error=missing_code`
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    // Tip: temporarily log error.message to server logs
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}${SIGNIN_PATH}?error=oauth_exchange`
    );
  }

  // ----- OPTIONAL: signal the client to hydrate user immediately -----
  // A tiny, short-lived, non-sensitive flag so your app can run a bootstrap
  // thunk that calls GET /api/me and fills Redux with the same SafeUser.
  (await cookies()).set('just_signed_in', '1', {
    path: '/',
    maxAge: 60,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  // -------------------------------------------------------------------

  return NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_SITE_URL));
}
