'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { parseAiSocial } from '@/utils/parseAiSocial';
import type { PostItem } from '@/types/social';
import { useAppSelector } from '@/redux/store';

export function useSavePost() {
  const auth = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const savePost = useCallback(
    async (input: string | PostItem) => {
      // 1) Require a signed-in user
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      setLoading(true);
      setFailed(false);
      try {
        // 2) Build the post (markdown or object)
        const post: PostItem =
          typeof input === 'string' ? parseAiSocial(input) : { ...input };

        // Ensure there's something to save (at least one social)
        if (!(post.linkedin || post.twitter || post.threads || post.official)) {
          throw new Error('Nothing to save: no social section found.');
        }

        // Optional client id for immediate routing/edit UX
        if (
          !post.id &&
          typeof crypto !== 'undefined' &&
          'randomUUID' in crypto
        ) {
          post.id = crypto.randomUUID();
        }

        const supabase = createClient();

        // Pull current posts
        const { data, error } = await supabase
          .from('profiles')
          .select('posts')
          .eq('id', auth.id) // safe after guard
          .single();
        if (error) throw error;

        const current = Array.isArray(data?.posts)
          ? (data.posts as PostItem[])
          : [];
        const next = [...current, post];

        // Save back
        const { error: upErr } = await supabase
          .from('profiles')
          .update({ posts: next })
          .eq('id', auth.id);
        if (upErr) throw upErr;

        toast.success('Post saved ✅', { autoClose: 3000 });
        return post;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to save post', { autoClose: 5000 });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id]
  );

  return { savePost, loading, failed };
}
