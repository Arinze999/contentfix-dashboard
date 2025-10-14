import type { User } from '@supabase/supabase-js';

export type SafeUser = {
  id: string | null;
  email: string | null;
  username: string | null;
};

export function toSafeUser(u: User | null | undefined): SafeUser {
  return {
    id: u?.id ?? null,
    email: u?.email ?? null,
    username: (u?.user_metadata as any)?.username ?? null,
  };
}
