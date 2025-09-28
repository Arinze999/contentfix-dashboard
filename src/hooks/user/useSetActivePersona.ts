'use client';

import { useCallback, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setPersonas,
  setActivePersona as setActivePersonaLocal,
} from '@/redux/slices/personasSlice';
import type { Personas } from '@/models/user/personaBrand.model';

export function useSetActivePersona() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const setActivePersona = useCallback(
    async (which: 'persona1' | 'persona2'): Promise<Personas | null> => {
      if (!auth?.id) {
        setFailed(true);
        toast.error('You must be signed in.', { autoClose: 4000 });
        return null;
      }

      setLoading(true);
      setFailed(false);

      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('set_active_persona', {
          uid: auth.id,
          which,
        });
        if (error) throw error;

        const row = Array.isArray(data) ? data[0] : data;
        const personas = (row?.personas ?? null) as Personas | null;

        if (personas) {
          dispatch(setPersonas(personas));
        } else {
          // fallback if RPC returns no body
          dispatch(setActivePersonaLocal(which));
        }

        toast.success(
          `Active persona set to ${
            which === 'persona1' ? 'Persona 1' : 'Persona 2'
          } ✅`,
          { autoClose: 2500 }
        );
        return personas;
      } catch (err: any) {
        setFailed(true);
        toast.error(err?.message || 'Failed to switch persona', {
          autoClose: 5000,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [auth?.id, dispatch]
  );

  return { setActivePersona, loading, failed };
}
