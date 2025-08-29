'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import type { SigninDataType } from '@/models/auth/SignIn.model';
import { signInAction } from '@/actions/signInAction';
import { setUser } from '@/redux/slices/authSlice';
import { ACCOUNT } from '@/routes/routes';

type UseServerSignInOptions = {
  redirectTo?: string;
  silent?: boolean;
};

export function useServerSignIn(opts: UseServerSignInOptions = {}) {
  const [serving, setServing] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const signIn = useCallback(
    async (values: SigninDataType) => {
      setServing(true);
      try {
        const res = await signInAction(values);

        if (!res.ok) {
          if (!opts.silent) alert(`Sign in failed: ${res.message}`);
          return;
        }

        // hydrate Redux (safe user payload from server action)
        if (res.user) dispatch(setUser(res.user));

        if (!opts.silent) alert(res.message || 'Signed in successfully.');

        //navigate
        router.refresh();
        router.replace(`/${opts.redirectTo ?? ACCOUNT}`);
      } catch (err: any) {
        if (!opts.silent)
          alert(`Unexpected error: ${err?.message ?? 'Something went wrong'}`);
      } finally {
        setServing(false);
      }
    },
    [dispatch, router, opts.redirectTo, opts.silent]
  );

  return { signIn, serving };
}
