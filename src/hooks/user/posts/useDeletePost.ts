'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { toast } from 'react-toastify';
import { removePost } from '@/redux/slices/postsSlice';
import { setPostsUpdatedAt } from '@/redux/slices/userDataSlice';
import type { PostItem } from '@/types/social';

export function useDeletePost() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const deletePost = useCallback(
    async (postId: string): Promise<PostItem | null> => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      if (!postId) {
        setFailed(true);
        toast.error('Missing post id.', { autoClose: 4000 });
        return null;
      }

      setLoading(true);
      setFailed(false);

      try {
        const supabase = createClient();

        const { data, error } = await supabase.rpc('delete_profile_post', {
          uid: auth.id,
          post_id: postId,
        });

        if (error) throw error;

        const row = Array.isArray(data) ? data[0] : data;
        const deletedPost = (row?.deleted_post ?? null) as PostItem | null;
        const ts = (row?.posts_updated_at ?? null) as string | null;

        if (!deletedPost) {
          toast.info('Post not found or already deleted.', { autoClose: 3500 });
          return null;
        }

        dispatch(removePost(postId));
        if (ts) dispatch(setPostsUpdatedAt(ts));

        toast.success('Post deleted ✅', { autoClose: 3000 });
        return deletedPost;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to delete post', {
          autoClose: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, dispatch]
  );

  return { deletePost, loading, failed };
}
