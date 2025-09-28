'use client';

import React from 'react';
import { useAppSelector } from '@/redux/store';
import { useSetActivePersona } from '@/hooks/user/useSetActivePersona';

type Props = { className?: string };

const PersonaDefaultToggle: React.FC<Props> = ({ className }) => {
  const personas = useAppSelector((s) => s.personas);
  const active = personas.persona1.default
    ? 'persona1'
    : personas.persona2.default
    ? 'persona2'
    : '';

  const { setActivePersona, loading } = useSetActivePersona();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const which = e.target.value as 'persona1' | 'persona2';
    if (which !== active) void setActivePersona(which);
  };

  return (
    <fieldset className={`flex items-center gap-6 ${className ?? ''}`}>
      <legend className="sr-only">Active persona</legend>

      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="activePersona"
          value="persona1"
          checked={active === 'persona1'}
          onChange={onChange}
          disabled={loading}
          className="h-4 w-4 accent-blue-500"
        />
        <span className="text-sm">Persona 1</span>
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="radio"
          name="activePersona"
          value="persona2"
          checked={active === 'persona2'}
          onChange={onChange}
          disabled={loading}
          className="h-4 w-4 accent-blue-500"
        />
        <span className="text-sm">Persona 2</span>
      </label>

      {loading && <span className="text-xs text-white/60">Switching…</span>}
    </fieldset>
  );
};

export default PersonaDefaultToggle;
