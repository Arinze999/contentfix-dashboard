// hooks/useGetPosts.ts
'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { setPosts, clearPosts } from '@/redux/slices/postsSlice';
import type { PostItem } from '@/types/social';
// optional: keep posts_updated_at in userData slice if you show it in UI
import { setPostsUpdatedAt } from '@/redux/slices/userDataSlice';

export function useGetPosts() {
  const dispatch = useDispatch();

  const [posts, setLocalPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (userId: string) => {
      if (!userId) {
        setLocalPosts([]);
        dispatch(clearPosts());
        // optional
        dispatch(setPostsUpdatedAt(null));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data: row, error } = await supabase
          .from('profiles')
          .select('posts, posts_updated_at')
          .eq('id', userId)
          .single();

        if (error || !row) {
          setError(error?.message ?? 'Not found');
          setLocalPosts([]);
          dispatch(clearPosts());
          // optional
          dispatch(setPostsUpdatedAt(null));
          return;
        }

        const list = Array.isArray(row.posts) ? (row.posts as PostItem[]) : [];
        setLocalPosts(list);
        dispatch(setPosts(list));
        // optional
        if ('posts_updated_at' in row) dispatch(setPostsUpdatedAt(row.posts_updated_at ?? null));
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
        setLocalPosts([]);
        dispatch(clearPosts());
        // optional
        dispatch(setPostsUpdatedAt(null));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { posts, loading, error, fetchPosts };
}
