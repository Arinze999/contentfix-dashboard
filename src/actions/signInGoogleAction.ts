'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { SIGN_IN } from '@/routes/routes';

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
function getRedirectURL() {
  return `${getSiteUrl()}/auth/callback`;
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectURL(),
      queryParams: {
        prompt: 'consent',
        access_type: 'offline',
        include_granted_scopes: 'true',
      },
    },
  });

  const signinPath = SIGN_IN.startsWith('/') ? SIGN_IN : `/${SIGN_IN}`;
  if (error || !data?.url) redirect(`${signinPath}?error=oauth_init`);

  // Next.js server actions can redirect to external URLs; this will jump to Google.
  redirect(data.url);
}
