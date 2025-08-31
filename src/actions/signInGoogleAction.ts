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

export type GoogleInitResult =
  | { ok: true; url: string; message?: string }
  | { ok: false; message: string };

/**
 * Starts Google OAuth. By default it **redirects immediately** (same as before).
 * If you pass { autoRedirect: false }, it returns a result object instead:
 *   - { ok: true, url } → set window.location.href = url
 *   - { ok: false, message } → show a toast or fallback UI
 */
export async function signInWithGoogle(
  next?: unknown,
  opts?: { autoRedirect?: boolean }
): Promise<GoogleInitResult | never> {
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

  const autoRedirect = opts?.autoRedirect ?? true;

  // Failure: either redirect (legacy behavior) or return an error result
  if (error || !data?.url) {
    const msg = 'Failed to initialize Google sign-in.';
    if (autoRedirect) {
      const signinPath = SIGN_IN.startsWith('/') ? SIGN_IN : `/${SIGN_IN}`;
      redirect(`${signinPath}?error=oauth_init`);
    }
    return { ok: false, message: msg };
  }

  // Success: either redirect (legacy behavior) or return the URL
  if (autoRedirect) {
    redirect(data.url);
  }

  return { ok: true, url: data.url, message: 'Redirecting to Google…' };
}

/**
 * Convenience helper if you always want a result (no auto redirect).
 * Usage in client: const res = await signInWithGoogleNoRedirect('/account')
 */
export async function signInWithGoogleNoRedirect(
  next?: unknown
): Promise<GoogleInitResult> {
  return signInWithGoogle(next, {
    autoRedirect: false,
  }) as Promise<GoogleInitResult>;
}
