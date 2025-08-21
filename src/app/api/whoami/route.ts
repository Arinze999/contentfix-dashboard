import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ALLOWLIST = new Set([
  process.env.LANDING_ORIGIN ?? 'https://contentfix-landing.vercel.app',
  process.env.LANDING_DEV ?? 'http://localhost:3000', // ← make sure this is localhost in dev
]);

function corsHeaders(origin?: string) {
  const ok = origin && ALLOWLIST.has(origin);
  const allowOrigin = ok ? origin! : 'null'; // or skip and 403
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Vary: 'Origin',
  };
}

// Preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    headers: corsHeaders(req.headers.get('origin') ?? undefined),
  });
}

export async function GET(req: NextRequest) {
  const headers = corsHeaders(req.headers.get('origin') ?? undefined);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  // Not authenticated
  if (error || !data.user) {
    return new NextResponse(JSON.stringify({ ok: false, user: null }), {
      status: 401,
      headers,
    });
  }

  // Build a safe payload only (NO TOKENS)
  const u = data.user;
  const user = {
    id: u.id,
    email: u.email,
    username: (u.user_metadata as any)?.username ?? null,
    avatar_url: (u.user_metadata as any)?.avatar_url ?? null,
  };

  return new NextResponse(JSON.stringify({ ok: true, user }), {
    status: 200,
    headers,
  });
}
