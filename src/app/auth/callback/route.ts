// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ACCOUNT, SIGN_IN } from '@/routes/routes';

export const dynamic = 'force-dynamic'; // ensure this route isn't statically optimized

const SIGNIN_PATH = `/${SIGN_IN}`;
const DEFAULT_NEXT = `/${ACCOUNT}`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const code  = url.searchParams.get('code');
  const err   = url.searchParams.get('error');
  const errDesc = url.searchParams.get('error_description') || undefined;

  // only allow relative "next" targets
  const rawNext = url.searchParams.get('next');
  const next = rawNext && rawNext.startsWith('/') ? rawNext : DEFAULT_NEXT;

  // If Google/Supabase sent an error or we don't have a code → go back to sign-in
  if (err) {
    return NextResponse.redirect(`${origin}${SIGNIN_PATH}?error=${encodeURIComponent(errDesc || err)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}${SIGNIN_PATH}?error=missing_code`);
  }

  const supabase = await createClient();

  // Exchange the auth code for a Supabase session (sets Supabase cookies via the helper)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  // (In some helper versions the signature is: exchangeCodeForSession({ authCode: code }))

  if (error || !data?.session) {
    return NextResponse.redirect(`${origin}${SIGNIN_PATH}?error=oauth_exchange`);
  }

  // OPTIONAL: set your own root-domain cookie for sharing session across apps
  // e.g., between landing and dashboard. If you don't need this, delete this block.
  const res = NextResponse.redirect(new URL(next, origin));
  if (process.env.ROOT_DOMAIN) {
    res.cookies.set('cf_session', data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain: process.env.ROOT_DOMAIN, // like ".contentfix.xyz"
      maxAge: data.session.expires_in, // seconds
    });
  }
  return res;
}
