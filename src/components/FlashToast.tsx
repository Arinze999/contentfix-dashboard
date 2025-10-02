'use client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

export default function FlashToast() {
  const search = useSearchParams();

  useEffect(() => {
    // 1) Play stored toast (set before redirect)
    const raw = sessionStorage.getItem('postAuthToast');
    if (raw) {
      sessionStorage.removeItem('postAuthToast');
      try {
        const { type, msg } = JSON.parse(raw);
        if (type === 'success') toast.success(msg || 'Success.');
        else if (type === 'error')
          toast.error(msg || 'Something went wrong.');
        else toast.info(msg || 'Okay.');
      } catch {}
    }

    // 2) Also handle callback query params if you add them (see below)
    const auth = search.get('auth'); // e.g. "success"
    const authErr = search.get('auth_err'); // string message
    if (auth === 'success') toast.success('Signed in with Google.');
    if (authErr) toast.error(authErr);
  }, [search]);

  return null;
}
