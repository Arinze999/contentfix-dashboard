'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppSelector } from '@/redux/store';
import { useGetUserData } from './user/useGetUserData';
import { useGetPosts } from './user/posts/useGetPosts';
import { useGetPersonas } from './user/useGetPersonas';

export function useWorkspaceLoading() {
  const auth = useAppSelector((s) => s.auth);
  const { fetchUserData } = useGetUserData();
  const { fetchPosts } = useGetPosts();
  const { fetchPersonas } = useGetPersonas();

  const [loading, setLoading] = useState(false);
  const runTokenRef = useRef<symbol | null>(null);

  const runAll = useCallback(
    async (uid: string) => {
      setLoading(true);
      const token = Symbol('workspace-load');
      runTokenRef.current = token;

      await Promise.allSettled([
        fetchUserData(uid),
        fetchPosts(uid),
        fetchPersonas(),
      ]);

      // avoid setting state if a newer run started
      if (runTokenRef.current === token) setLoading(false);
    },
    [fetchUserData, fetchPosts, fetchPersonas]
  );

  useEffect(() => {
    // no user -> nothing to load
    if (!auth?.id) {
      setLoading(false);
      return;
    }
    // user present -> load everything
    runAll(auth.id);
  }, [auth?.id, runAll]);

  return { loading };
}
