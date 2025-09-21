'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { parseAiSocial } from '@/utils/parseAiSocial';
import type { PostItem } from '@/types/social';
import { useAppSelector } from '@/redux/store';

// optional: keep Redux in sync
import { addPost } from '@/redux/slices/postsSlice';
import { setPostsUpdatedAt } from '@/redux/slices/userDataSlice';

export function useSavePost() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const savePost = useCallback(
    async (input: string | PostItem) => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      setLoading(true);
      setFailed(false);
      try {
        // Build the post (markdown or object)
        const post: PostItem =
          typeof input === 'string' ? parseAiSocial(input) : { ...input };

        if (!(post.linkedin || post.twitter || post.threads || post.official)) {
          throw new Error('Nothing to save: no social section found.');
        }

        const supabase = createClient();

        // Atomic append via RPC; RLS applies; trigger injects server id
        const { data, error } = await supabase.rpc('append_profile_post', {
          uid: auth.id,
          new_post: post,
        });
        if (error) throw error;

        // `returns table` comes back as an array with one row
        const row = Array.isArray(data) ? data[0] : data;
        const savedPost = (row?.post ?? null) as PostItem | null;
        const ts = (row?.posts_updated_at ?? null) as string | null;

        if (!savedPost) {
          // Fallback — should not happen if RPC is as defined
          toast.warn('Saved, but could not read back the new post.', { autoClose: 4000 });
          return null;
        }

        dispatch(addPost(savedPost));
        if (ts) dispatch(setPostsUpdatedAt(ts));

        toast.success('Post saved ✅', { autoClose: 3000 });
        return savedPost;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to save post', { autoClose: 5000 });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, dispatch]
  );

  return { savePost, loading, failed };
}
