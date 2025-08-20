import { DASHBOARD, SIGN_IN } from '@/routes/routes';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath(`${DASHBOARD}`, 'layout');
  return NextResponse.redirect(new URL(`/${SIGN_IN}`, req.url), {
    status: 302,
  });
}
