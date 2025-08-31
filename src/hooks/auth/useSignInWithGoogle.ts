'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { signInWithGoogle } from '@/actions/signInGoogleAction';

type UseSignInWithGoogleOpts = {
  next?: string; // optional next path, e.g. '/account'
  silent?: boolean; // suppress toasts
};

export function useSignInWithGoogle(opts: UseSignInWithGoogleOpts = {}) {
  const [serving, setServing] = useState(false);

  const startGoogle = useCallback(async () => {
    setServing(true);
    try {
      const res = await signInWithGoogle(opts.next, { autoRedirect: false });

      if (!res.ok) {
        if (!opts.silent) {
          toast.error(res.message || 'Could not start Google sign-in.', {
            autoClose: 6000,
          });
          // store error toast for after redirect if needed
          sessionStorage.setItem(
            'postAuthToast',
            JSON.stringify({ type: 'error', msg: res.message })
          );
        }
        return;
      }

      if (!opts.silent) {
        toast.info(res.message || 'Opening Google…', { autoClose: 1500 });
        // store success/info toast for after redirect
        sessionStorage.setItem(
          'postAuthToast',
          JSON.stringify({ type: 'success', msg: 'Signed in with Google.' })
        );
      }

      // finish by navigating to Google's OAuth URL
      window.location.href = res.url;
    } catch (err: any) {
      const msg = err?.message ?? 'Unexpected error';
      if (!opts.silent) {
        toast.error(msg, { autoClose: 6000 });
        sessionStorage.setItem(
          'postAuthToast',
          JSON.stringify({ type: 'error', msg })
        );
      }
    } finally {
      setServing(false);
    }
  }, [opts.next, opts.silent]);

  return { startGoogle, serving };
}
