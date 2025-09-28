'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setPersonas, clearPersonas } from '@/redux/slices/personasSlice';
import type { Personas } from '@/models/user/personaBrand.model';

export function useGetPersonas() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [data, setData] = useState<Personas | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const fetchPersonas = useCallback(async () => {
    if (!auth?.id) {
      setData(null);
      dispatch(clearPersonas());
      return null;
    }

    setLoading(true);
    setFailed(false);

    try {
      const supabase = createClient();
      const { data: row, error } = await supabase
        .from('profiles')
        .select('personas, personas_updated_at')
        .eq('id', auth.id)
        .single();

      if (error) throw error;

      const personas = (row?.personas ?? null) as Personas | null;
      setData(personas);
      if (personas) dispatch(setPersonas(personas));
      return personas;
    } catch (err: any) {
      setFailed(true);
      setData(null);
      dispatch(clearPersonas());
      toast.error(err?.message || 'Failed to fetch personas', {
        autoClose: 4500,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth?.id, dispatch]);

  return { data, loading, failed, fetchPersonas };
}
