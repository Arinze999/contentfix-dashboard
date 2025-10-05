'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { toast } from 'react-toastify';
import { setAvatarUrl, setUpdatedAt } from '@/redux/slices/userDataSlice';
import type { ProfileImageDataType } from '@/models/user/profileImage.model';

function extFromMime(mime: string | undefined) {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    default:
      return 'png'; // safe default
  }
}

export function useUploadProfileImage() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const uploadProfileImage = useCallback(
    async (values: ProfileImageDataType): Promise<string | null> => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      const file = values?.profileImage as File | null;
      if (!(file instanceof File)) {
        setFailed(true);
        toast.error('No file selected.', { autoClose: 3000 });
        return null;
      }

      setLoading(true);
      setFailed(false);

      try {
        const supabase = createClient();

        const folder = auth.id; // 1 folder per user
        const key = `${folder}/avatar.${extFromMime(file.type)}`; // single, deterministic path

        // (optional) clean up any stray old files in this folder so only ONE stays
        const { data: existing, error: listErr } = await supabase.storage
          .from('avatars')
          .list(folder, { limit: 100 });
        if (listErr) throw listErr;

        if (existing && existing.length) {
          const toRemove = existing
            .map((o) => `${folder}/${o.name}`)
            .filter((path) => path !== key); // keep our target key
          if (toRemove.length) {
            const { error: delErr } = await supabase.storage
              .from('avatars')
              .remove(toRemove);
            if (delErr) throw delErr;
          }
        }

        // Upload with upsert to overwrite the single key
        const { error: upErr } = await supabase.storage
          .from('avatars')
          .upload(key, file, {
            upsert: true,
            contentType: file.type || undefined,
          });
        if (upErr) throw upErr;

        // Resolve public URL (assuming bucket is public)
        const { data: pub } = supabase.storage
          .from('avatars')
          .getPublicUrl(key);
        const publicUrl = pub?.publicUrl || null;
        if (!publicUrl) throw new Error('Could not resolve public URL.');

        // Persist on profile via RPC
        const { data, error: rpcErr } = await supabase.rpc(
          'set_profile_avatar',
          {
            uid: auth.id,
            new_avatar_url: publicUrl, // make sure RPC param matches!
          }
        );
        if (rpcErr) throw rpcErr;

        const updatedAt = Array.isArray(data)
          ? data[0]?.updated_at
          : (data as any)?.updated_at;

        // Redux sync
        dispatch(setAvatarUrl(publicUrl));
        if (updatedAt) dispatch(setUpdatedAt(updatedAt));

        toast.success('Profile image updated', { autoClose: 3000 });
        return publicUrl;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to upload image', {
          autoClose: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, dispatch]
  );

  return { uploadProfileImage, loading, failed };
}
