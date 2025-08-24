'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { SIGN_IN } from '@/routes/routes';

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

function makeRedirectTo(next?: unknown) {
  const base = getBaseUrl();
  let safeNext: string | undefined;
  if (typeof next === 'string' && next.startsWith('/')) {
    safeNext = next;
  }
  const qs = safeNext ? `?next=${encodeURIComponent(safeNext)}` : '';
  return `${base}/auth/callback${qs}`;
}

export async function signInWithGoogle(next?: unknown) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: makeRedirectTo(next),
      queryParams: {
        prompt: 'consent',
        access_type: 'offline',
        include_granted_scopes: 'true',
      },
    },
  });

  const signinPath = SIGN_IN.startsWith('/') ? SIGN_IN : `/${SIGN_IN}`;
  if (error || !data?.url) redirect(`${signinPath}?error=oauth_init`);
  redirect(data.url);
}
