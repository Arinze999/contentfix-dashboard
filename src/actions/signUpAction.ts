'use server';

import { createClient } from '@/utils/supabase/server';

export async function signUpAction(input: {
  userName: string;
  identifier: string; // email or phone
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
          full_name: input.userName || undefined,
          username: input.userName || undefined,
          avatar_url: input.avatarUrl || undefined,
        },
      },
    });

    // --- classify outcome (no resend logic) ---
    if (error) {
      return { ok: false, status: 400, message: error.message };
    }

    const user = data?.user as any;
    const identitiesLen = Array.isArray(user?.identities)
      ? user.identities.length
      : 0;

    // Duplicate: Supabase returns a "user" with empty identities
    if (user && identitiesLen === 0) {
      return {
        ok: false,
        status: 409,
        message: usingEmail
          ? 'This email is already registered.'
          : 'This phone is already registered.',
      };
    }

    // New account created (requires verification)
    return {
      ok: true,
      status: 201,
      message: usingEmail
        ? 'Account created. Please verify your email.'
        : 'Account created. Please check SMS for verification.',
    };
  } catch (e: any) {
    return { ok: false, status: 500, message: e?.message ?? 'Unknown error' };
  }
}

function normalizePhone(raw: string) {
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}
