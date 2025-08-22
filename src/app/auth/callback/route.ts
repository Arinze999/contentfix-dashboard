// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ACCOUNT, SIGN_IN } from '@/routes/routes';

export const dynamic = 'force-dynamic';

const SIGNIN_PATH = SIGN_IN.startsWith('/') ? SIGN_IN : `/${SIGN_IN}`;
const DEFAULT_NEXT = ACCOUNT.startsWith('/') ? ACCOUNT : `/${ACCOUNT}`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  // Normalize & validate inputs
  const code = url.searchParams.get('code');
  const errParam =
    url.searchParams.get('error') ||
    url.searchParams.get('error_code') ||
    undefined;
  const errDesc = url.searchParams.get('error_description') || undefined;

  const rawNext = url.searchParams.get('next');
  const next = rawNext && rawNext.startsWith('/') ? rawNext : DEFAULT_NEXT;

  // Provider returned an error or we have no code → back to sign-in
  if (errParam) {
    return NextResponse.redirect(
      `${origin}${SIGNIN_PATH}?error=${encodeURIComponent(errDesc || errParam)}`
    );
  }
  if (!code) {
    return NextResponse.redirect(`${origin}${SIGNIN_PATH}?error=missing_code`);
  }

  // Exchange the auth code for a session and set Supabase cookies
  const supabase = await createClient();

  let data: any, error: any;
  try {
    const exchange = supabase.auth.exchangeCodeForSession as any;
    // Some versions take (code: string), others ({ authCode: string })
    ({ data, error } =
      exchange.length === 1
        ? await exchange(code)
        : await exchange({ authCode: code }));
  } catch (e) {
    error = e;
  }

  if (error || !data?.session) {
    return NextResponse.redirect(
      `${origin}${SIGNIN_PATH}?error=oauth_exchange`
    );
  }

  // Optional: cross-subdomain cookie (remove if you don't need it)
  const res = NextResponse.redirect(new URL(next, origin));
  if (process.env.ROOT_DOMAIN) {
    res.cookies.set('cf_session', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain: process.env.ROOT_DOMAIN, // e.g. ".yourdomain.com"
      maxAge: data.session.expires_in, // seconds
    });
  }
  return res;
}
