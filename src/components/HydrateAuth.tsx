'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import type { AuthUser } from '@/models/auth/SignIn.model';
import { ME } from '@/routes/routes';

export default function HydrateAuth({ user }: { user: AuthUser }) {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false); // guard against double-invoke in Strict Mode

  useEffect(() => {
    // If SSR already gave us a user, hydrate and exit
    if (user?.id) {
      dispatch(setUser(user));
      return;
    }

    // Otherwise, (first render only) try client bootstrap via /api/me
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const res = await fetch(ME, { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json(); // { ok: boolean, user?: { id,email,username } }
        if (json?.ok && json.user) {
          dispatch(setUser(json.user));
        }
      } catch {
        // swallow silently; UI can still function unauthenticated
      }
    })();
  }, [dispatch, user]);

  return null;
}
