import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function getSessionAndResponse(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // Create a fresh response for writing cookies
          response = NextResponse.next({ request });

          // Detect HTTPS (required for `Secure`)
          const isHttps =
            request.headers.get('x-forwarded-proto') === 'https' ||
            request.nextUrl.protocol === 'https:';

          cookiesToSet.forEach(({ name, value, options }) => {
            // Force attributes so cookies can be sent cross-site
            const merged = {
              ...options,
              path: '/',              // good default
              sameSite: 'none' as const, // allow third‑party requests
              secure: true,           // must be true when SameSite=None (and works on Vercel HTTPS)
            };

            // NOTE: On localhost over http, `secure: true` cookies won't be set by the browser.
            // That's fine for deployed dashboard; for local dashboard you can conditionally relax:
             if (!isHttps) merged.secure = false;

            response.cookies.set(name, value, merged);
          });
        },
      },
    }
  );

  // Validate/refresh session (rotates cookies if needed -> triggers setAll above)
  const { data, error } = await supabase.auth.getUser();

  return { response, user: data?.user ?? null, error: error ?? null };
}
