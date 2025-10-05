'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setPersonas } from '@/redux/slices/personasSlice';
import type {
  PersonasFormData,
  Personas,
} from '@/models/user/personaBrand.model';

export function useEditPersonas() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const editPersonas = useCallback(
    async (values: PersonasFormData): Promise<Personas | null> => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      // Normalize payload (schema already validated: max one default=true)
      const next: Personas = {
        persona1: {
          description: (values.persona1?.description ?? '').trim(),
          default: !!values.persona1?.default,
        },
        persona2: {
          description: (values.persona2?.description ?? '').trim(),
          default: !!values.persona2?.default,
        },
      };

      // safety: if both somehow true, force persona2 false
      if (next.persona1.default && next.persona2.default) {
        next.persona2.default = false;
      }

      setLoading(true);
      setFailed(false);

      try {
        const supabase = createClient();
        const { data: row, error } = await supabase
          .from('profiles')
          .update({ personas: next })
          .eq('id', auth.id)
          .select('personas, personas_updated_at')
          .single();

        if (error) throw error;

        const updated = row?.personas as Personas;
        dispatch(setPersonas(updated));
        toast.success('Personas saved', { autoClose: 3000 });
        return updated;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to save personas', {
          autoClose: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, dispatch]
  );

  return { editPersonas, loading, failed };
}
