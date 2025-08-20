'use server';

import { createClient } from '@/utils/supabase/server';

export async function signUpAction(input: {
  userName: string;
  identifier: string;
  password: string;
  avatarUrl?: string;
}) {
  try {
    const supabase = await createClient();

    const usingEmail = input.identifier.includes('@');
    const creds = usingEmail
      ? { email: input.identifier }
      : { phone: normalizePhone(input.identifier) };

    const { data, error } = await supabase.auth.signUp({
      ...creds,
      password: input.password,
      options: {
        data: {
          username: input.userName || undefined,
          avatar_url: input.avatarUrl || undefined,
        },
      },
    });

     console.log(data)

    if (error) {
      return { ok: false, message: error.message };
    }

    // Return a message to the client; show alerts in the client UI.
    return {
      ok: true,
      message: usingEmail
        ? 'Account created. Please verify your email.'
        : 'Account created. Please check SMS for verification.',
    };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'Unknown error' };
  }
}

function normalizePhone(raw: string) {
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}
