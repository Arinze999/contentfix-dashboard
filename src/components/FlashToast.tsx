'use client';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

export default function FlashToast({
  justSignedIn = false,
}: {
  justSignedIn?: boolean;
}) {
  const search = useSearchParams();
  const shownRef = useRef(false); // prevent double toasts

  useEffect(() => {
    if (!justSignedIn || shownRef.current) return; // 🚧 only show if cookie says we truly signed in
    shownRef.current = true;

    // 1) Google flow via sessionStorage (your current approach)
    const raw = sessionStorage.getItem('postAuthToast');
    if (raw) {
      sessionStorage.removeItem('postAuthToast');
      try {
        const { type, msg } = JSON.parse(raw);
        if (type === 'success') toast.success(msg || 'Signed in with Google.');
        else if (type === 'error') toast.error(msg || 'Google sign-in failed.');
        else toast.info(msg || 'Okay.');
        return;
      } catch {
        // fall through to query params
      }
    }

    // 2) (Optional) Google flow via query params, if you add ?auth=success&auth_err=...
    const authErr = search.get('auth_err');
    if (authErr) {
      toast.error(authErr);
      return;
    }
    const auth = search.get('auth');
    if (auth === 'success') {
      toast.success('Signed in with Google.');
    }
  }, [search, justSignedIn]);

  return null;
}
