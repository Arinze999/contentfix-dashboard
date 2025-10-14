import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { toSafeUser } from '@/utils/auth/toSafeUser';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: toSafeUser(user) });
}
