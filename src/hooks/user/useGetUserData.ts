'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux'; // or useAppDispatch
import { createClient } from '@/utils/supabase/client';
import { setUserData, clearUserData } from '@/redux/slices/userDataSlice';
import { UserData, initialUserData } from '@/models/user/UserData.model';

export function useGetUserData() {
  const dispatch = useDispatch();
  const [data, setData] = useState<UserData>(initialUserData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(
    async (userId: string) => {
      if (!userId) {
        setData(initialUserData);
        dispatch(clearUserData());
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data: row, error } = await supabase
          .from('profiles') // ensure this table matches UserData shape
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !row) {
          setError(error?.message ?? 'Not found');
          setData(initialUserData);
          dispatch(clearUserData());
        } else {
          const typed = row as UserData; // relies on DB shape == model
          setData(typed);
          dispatch(setUserData(typed));
        }
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
        setData(initialUserData);
        dispatch(clearUserData());
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { data, loading, error, fetchUserData };
}
