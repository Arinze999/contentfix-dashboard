'use server';

import { createClient } from '@/utils/supabase/server';

export type SignInInput = {
  identifier: string; // email or phone
  password: string;
};

export async function signInAction(input: SignInInput) {
  try {
    const supabase = await createClient();

    const usingEmail = input.identifier.includes('@');
    const creds = usingEmail
      ? { email: input.identifier }
      : { phone: normalizePhone(input.identifier) };

    const { data, error } = await supabase.auth.signInWithPassword({
      ...creds,
      password: input.password,
    });

    console.log(data);

    if (error) {
      return { ok: false, message: error.message };
    }
                                                                                 
    // SAFE user payload for client/Redux (no tokens)
    const u = data.user;
    const user = {
      id: u?.id ?? null,
      email: u?.email ?? null,
      username: (u?.user_metadata as any)?.username ?? null,
    };

    return { ok: true, message: 'Signed in successfully.', user };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'Unknown error' };
  }
}

function normalizePhone(raw: string) {
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}
