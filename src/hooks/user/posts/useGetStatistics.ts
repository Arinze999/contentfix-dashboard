// hooks/useGetStatistics.ts
'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { fetchStart, fetchSuccess, fetchFailure } from '@/redux/slices/statisticsSlice';
import type { Statistics } from '@/redux/slices/statisticsSlice';

export function useGetStatistics() {
  const dispatch = useDispatch();

  const [stats, setLocalStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchStatistics = useCallback(
    async (tableName = 'public.profiles', colName = 'posts') => {
      setLoading(true);
      setError(null);
      dispatch(fetchStart());

      try {
        const supabase = createClient();

        const { data, error } = await supabase.rpc('get_statistics', {
          table_name: tableName,
          col_name: colName,
        });

        if (error) {
          const msg = error.message ?? 'Failed to fetch statistics';
          setLocalStats(null);
          setError(msg);
          dispatch(fetchFailure(msg));
          return null;
        }

        const payload: Statistics = {
          linkedin: String((data as any)?.linkedin ?? '0'),
          twitter:  String((data as any)?.twitter  ?? '0'),
          threads:  String((data as any)?.threads  ?? '0'),
          official: String((data as any)?.official ?? '0'),
        };

        setLocalStats(payload);
        dispatch(fetchSuccess(payload));
        return payload;
      } catch (e: any) {
        const msg = e?.message ?? 'Unknown error';
        setLocalStats(null);
        setError(msg);
        dispatch(fetchFailure(msg));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { stats, loading, error, fetchStatistics };
}
