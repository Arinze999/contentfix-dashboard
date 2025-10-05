'use client';

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import {
  ratingSetPending,
  ratingSetSuccess,
  ratingSetError,
  ratingReset,
  type RatingRpcRow,
} from '@/redux/slices/ratingSlice';
// optional: if you also mirror updated_at in a userData slice, uncomment:
// import { setRatingUpdatedAt } from '@/redux/slices/userDataSlice';

export function useGetRating() {
  const dispatch = useDispatch();

  const [rating, setLocalRating] = useState<RatingRpcRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRating = useCallback(
    async (userId: string) => {
      if (!userId) {
        setLocalRating(null);
        dispatch(ratingReset());
        // optional:
        // dispatch(setRatingUpdatedAt(null));
        return;
      }

      setLoading(true);
      setError(null);
      dispatch(ratingSetPending());

      try {
        const supabase = createClient();
        const { data: row, error } = await supabase
          .from('profiles')
          .select('rating, rating_updated_at')
          .eq('id', userId)
          .single();

        if (error || !row) {
          const msg = error?.message ?? 'Profile not found';
          setError(msg);
          setLocalRating(null);
          dispatch(ratingSetError(msg));
          // optional:
          // dispatch(setRatingUpdatedAt(null));
          return;
        }

        const r = (row.rating ?? {}) as {
          level?: number | null;
          info?: string | null;
        };

        const normalized: RatingRpcRow = {
          level: typeof r.level === 'number' ? r.level : null,
          info: typeof r.info === 'string' ? r.info : r.info ?? null,
          rating_updated_at: row.rating_updated_at ?? null,
        };

        setLocalRating(normalized);
        dispatch(ratingSetSuccess(normalized));
        // optional:
        // dispatch(setRatingUpdatedAt(row.rating_updated_at ?? null));
      } catch (e: any) {
        const msg = e?.message ?? 'Unknown error';
        setError(msg);
        setLocalRating(null);
        dispatch(ratingSetError(msg));
        // optional:
        // dispatch(setRatingUpdatedAt(null));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { rating, loading, error, fetchRating };
}
