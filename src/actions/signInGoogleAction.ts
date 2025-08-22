// app/actions/auth.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { SIGN_IN } from '@/routes/routes';

function getRedirectURL() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
  return `${base}/auth/callback`;
}

// Option A: server-side redirect immediately
export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectURL(),
      // optional but useful:
      queryParams: { prompt: 'consent', access_type: 'offline' },
    },
  });

  if (error || !data?.url) {
    redirect(`/${SIGN_IN}?error=oauth_init`);
  }

  // Jumps to Google
  redirect(data.url);
}
