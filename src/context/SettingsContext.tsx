'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export type SafeUser = {
  id: string | null;
  email: string | null;
  username: string | null;
  avatar_url?: string | null;
} | null;

type SettingsContextValue = {
  user: SafeUser;
  setUser: (u: SafeUser) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser>(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
