'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { toast } from 'react-toastify';
import { setUsername, setUpdatedAt } from '@/redux/slices/userDataSlice';
import type { BasicInfoDataType } from '@/models/user/basicInfo.model';

export function useEditProfile() {
  const auth = useAppSelector((s) => s.auth);
  const currentUsername = useAppSelector((s) => s.userData.username);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const editProfile = useCallback(
    async (values: BasicInfoDataType): Promise<string | null> => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      // We only care about username; email is ignored
      const nextUsername = (values?.userName ?? '').trim();
      if (!nextUsername) {
        setFailed(true);
        toast.error('Username is required.', { autoClose: 3500 });
        return null;
      }

      if ((currentUsername ?? '').trim() === nextUsername) {
        toast.info('No changes to save.', { autoClose: 2500 });
        return nextUsername;
      }

      setLoading(true);
      setFailed(false);

      try {
        const supabase = createClient();

        // Update only username; RLS ensures user can update their own row
        const { data, error } = await supabase
          .from('profiles')
          .update({ username: nextUsername })
          .eq('id', auth.id)
          .select('username, updated_at')
          .single();

        if (error) {
          // Handle common constraint errors nicely
          // 23505 = unique_violation, 23514 = check_violation
          if ((error as any).code === '23505') {
            throw new Error('That username is already taken.');
          }
          if ((error as any).code === '23514') {
            throw new Error('Username does not meet requirements.');
          }
          throw error;
        }

        dispatch(setUsername(data.username ?? nextUsername));
        if (data?.updated_at) dispatch(setUpdatedAt(data.updated_at));

        toast.success('Profile updated ✅', { autoClose: 3000 });
        return data?.username ?? nextUsername;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to update profile', {
          autoClose: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, currentUsername, dispatch]
  );

  return { editProfile, loading, failed };
}
