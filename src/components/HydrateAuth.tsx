'use client';

import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import { type AuthUser } from '@/models/auth/SignIn.model';

export default function HydrateAuth({ user }: { user: AuthUser }) {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);
  return null;
}
