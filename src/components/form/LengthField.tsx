'use client';

import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import clsx from 'clsx';

type Length = 'short' | 'average' | 'long';

const LENGTHS: { id: Length; label: string; emoji: string; desc: string }[] = [
  { id: 'short',   label: 'Short',   emoji: '⚡', desc: '~1–2 lines' },
  { id: 'average', label: 'Average', emoji: '✍️', desc: '~3–5 lines' },
  { id: 'long',    label: 'Long',    emoji: '📜', desc: '6+ lines' },
];

type Props = {
  name: string; // e.g., "length" or "postLength"
  label?: string;
  className?: string;
  disabled?: boolean;
};

const LengthField: React.FC<Props> = ({
  name,
  label = 'Length',
  className = '',
  disabled = false,
}) => {
  const [field, meta, helpers] = useField<Length>({ name } as FieldHookConfig<Length>);
  const current: Length = (field.value as Length) ?? 'average';
  const hasError = Boolean(meta.touched && meta.error);

  const choose = (id: Length) => {
    if (disabled) return;
    helpers.setValue(id);
    helpers.setTouched(true, true);
  };

  return (
    <div className={clsx('mb-6 w-full', className)}>
      <div className="mb-2 block text-sm font-semibold text-white/70">{label}</div>

      <div role="radiogroup" aria-label={label} className="flex items-center gap-2">
        {LENGTHS.map((opt) => {
          const active = current === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(opt.id)}
              disabled={disabled}
              title={opt.desc}
              className={clsx(
                'md:px-3 md:py-2 px-2 py-0.7 rounded-lg border md:text-sm text-[12px] flex items-center gap-2 transition-colors',
                active
                  ? 'border-purple-500 bg-purple-600/50 text-white'
                  : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span aria-hidden="true" className="text-base">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {hasError && <p className="mt-1 text-sm text-red-500">{meta.error as string}</p>}
    </div>
  );
};

export default LengthField;
