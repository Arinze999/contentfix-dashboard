'use client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/store';

export default function FlashToast() {
  const search = useSearchParams();

  const Id = useAppSelector((state) => state.auth.id);

  useEffect(() => {
    // 1) Play stored toast (set before redirect)
    const raw = sessionStorage.getItem('postAuthToast');
    if (raw) {
      sessionStorage.removeItem('postAuthToast');
      try {
        const { type, msg } = JSON.parse(raw);
        if (type === 'success' && Id) toast.success(msg || 'Success.');
        else if (type === 'error' && Id)
          toast.error(msg || 'Something went wrong.');
        else toast.info(msg || 'Okay.');
      } catch {}
    }

    // 2) Also handle callback query params if you add them (see below)
    const auth = search.get('auth'); // e.g. "success"
    const authErr = search.get('auth_err'); // string message
    if (auth === 'success' && Id) toast.success('Signed in with Google.');
    if (authErr) toast.error(authErr);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [search]);

  return null;
}
