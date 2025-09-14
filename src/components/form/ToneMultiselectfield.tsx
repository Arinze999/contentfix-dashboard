'use client';

import React, { useEffect } from 'react';
import { useField, FieldHookConfig } from 'formik';
import clsx from 'clsx';

type Option = { id: string; label: string };

type Props = {
  name: string; // e.g., "tones"
  options: Option[]; // e.g., TONE_OPTIONS
  label?: string;
  className?: string;
  maxSelected?: number; // default 2
  disabled?: boolean;
};

const ToneMultiSelectField: React.FC<Props> = ({
  name,
  options,
  label = 'Tone',
  className = '',
  maxSelected = 2,
  disabled = false,
}) => {
  const [field, meta, helpers] = useField<string[]>({ name } as FieldHookConfig<
    string[]
  >);
  const selected = Array.isArray(field.value) ? field.value : [];
  const hasError = Boolean(meta.touched && meta.error);

  // Ensure array default
  useEffect(() => {
    if (!Array.isArray(field.value)) helpers.setValue([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    if (disabled) return;
    const isActive = selected.includes(id);
    if (isActive) {
      helpers.setValue(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= maxSelected) return; // prevent selecting > max
      helpers.setValue([...selected, id]);
    }
    helpers.setTouched(true, true);
  };

  return (
    <div className={clsx('mb-6 w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-semibold text-white/70">
          {label}
        </label>
        <span className="text-xs text-white/50">
          {selected.length}/{maxSelected} selected
        </span>
      </div>

      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => toggle(opt.id)}
              disabled={disabled || (!active && selected.length >= maxSelected)}
              className={clsx(
                'md:px-3 md:py-1.5 px-2 py-0.7 rounded-full md:text-sm text-[12px] transition-colors',
                'border-2 bg-white/5',
                active
                  ? 'border-purple-500 text-white bg-purple-600/60'
                  : 'border-white/15 text-white/80 hover:bg-white/10',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {hasError && (
        <p className="mt-1 text-sm text-red-500">{meta.error as string}</p>
      )}
    </div>
  );
};

export default ToneMultiSelectField;
