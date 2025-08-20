'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { SignupDataType } from '@/models/auth/SignUp.model';

type Extra = {
  avatarUrl?: string; // optional for when you add it later
};

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signupUser = useCallback(
    async (
      values: SignupDataType,
    //   actions: FormikHelpers<SignupDataType>,
      extra?: Extra
    ) => {
      setLoading(true);
      try {
        const supabase = await createClient();

        const { userName, identifier, password } = values;
        const { avatarUrl } = extra ?? {};

        // cred selection
        const usingEmail = identifier.includes('@');
        const creds = usingEmail
          ? { email: identifier }
          : { phone: normalizePhone(identifier) };

        // pass metadata to raw_user_meta_data (used by your trigger)
        const options = {
          data: {
            username: userName || undefined,
            avatar_url: avatarUrl || undefined,
          },
        } as const;

        // sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          ...creds,
          password,
          options,
        });

         console.log(signUpData)

        if (signUpError) {
          alert(`Sign up failed: ${signUpError.message}`);
        //   actions.setFieldError('identifier', signUpError.message);
          return;
        }

        // Some flows (email/phone) require verification before session exists
        alert(usingEmail
          ? 'Account created. Please check your email to verify your account.'
          : 'Account created. Please check your SMS for a verification code.');

        // Clear form & go to signin
        // actions.resetForm({ values: SignupInitialValues });
        router.refresh();
        router.push('/signin');
      } catch (err: any) {
        alert(`Unexpected error: ${err?.message ?? 'something went wrong'}`);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { signupUser, loading };
}

// Helpers
function normalizePhone(raw: string) {
  // Very light normalization: ensure it starts with '+'
  const trimmed = raw.replace(/\s+/g, '');
  if (trimmed.startsWith('+')) return trimmed;
  // You can improve this per your locale (e.g., +234 for Nigeria)
  return `+${trimmed}`;
}
