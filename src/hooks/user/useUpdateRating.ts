'use client';

import { useCallback, useState } from 'react';
import type { RatingsDataType } from '@/models/user/ratings.model';
import { createClient } from '@/utils/supabase/client';
import { useAppDisPatch } from '@/redux/store';
import {
  ratingSetPending,
  ratingSetSuccess,
  ratingSetError,
  type RatingRpcRow,
} from '@/redux/slices/ratingSlice';
import { toast } from 'react-toastify';

type Input = Pick<RatingsDataType, 'ratings' | 'info'>;

export function useUpdateRating() {
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);
  const [data, setData] = useState<RatingRpcRow | null>(null);
  const dispatch = useAppDisPatch();

  const updateRating = useCallback(
    async (input: Input) => {
      // local state
      setLoading(true);
      setErr(null);
      // redux state
      dispatch(ratingSetPending());

      const payload = {
        level: typeof input.ratings === 'number' ? input.ratings : 0,
        info: input.info ?? '',
      };

      const supabase = createClient();

      const { data: res, error } = await supabase.rpc('update_rating', {
        payload,
      });

      if (error) {
        setErr(error.message);
        setLoading(false);
        dispatch(ratingSetError(error.message));
        toast.error(error.message, { autoClose: 3000 });
        throw error;
      }

      // RPC returns an array (TABLE return type)
      const row: RatingRpcRow | null = Array.isArray(res)
        ? res[0] ?? null
        : (res as any);

      if (row) {
        setData(row);
        dispatch(ratingSetSuccess(row));
        toast.success('Rating updated, Thank you!', { autoClose: 3000 });
      } else {
        // Edge case: empty result
        dispatch(ratingSetError('No rating returned from server.'));
        toast.error('No rating returned from server.', { autoClose: 3000 });
      }

      setLoading(false);
      return row;
    },
    [dispatch]
  );

  return { updateRating, loading, error: error, data };
}
