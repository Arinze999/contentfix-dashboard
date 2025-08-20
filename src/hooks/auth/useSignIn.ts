'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { SigninDataType } from '@/models/auth/SignIn.model';
import { ACCOUNT } from '@/routes/routes';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInUser = useCallback(
    async (values: SigninDataType) => {
      setLoading(true);
      try {
        const supabase = await createClient();
        const { identifier, password } = values;

        const usingEmail = identifier.includes('@');
        const creds = usingEmail
          ? { email: identifier }
          : { phone: normalizePhone(identifier) };

        const { data, error } = await supabase.auth.signInWithPassword({
          ...creds,
          password,
        });

         console.log(data)

        if (error) {
          alert(`Sign in failed: ${error.message}`);
          return;
        }

        alert('Signed in successfully.');
        router.refresh();
        router.push(`/${ACCOUNT}`);
      } catch (e: any) {
        alert(`Unexpected error: ${e?.message ?? 'Something went wrong'}`);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { signInUser, loading };
}

// Very light phone normalization; adapt to +234 if you like
function normalizePhone(raw: string) {
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  return `+${trimmed}`;
}
