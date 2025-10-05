'use client';

import React, { useCallback } from 'react';
import { useField, useFormikContext } from 'formik';

type Props = {
  /** Formik field name (e.g., "ratings") */
  name: string;
  /** Optional question text */
  question?: string;
  /** Minimum and maximum rating (defaults 1–10) */
  min?: number;
  max?: number;
  /** Optional className passthrough */
  className?: string;
};

export default function CustomRating({
  name,
  question = 'How likely are you to recommend ContentFix to others?',
  min = 1,
  max = 10,
  className = '',
}: Props) {
  const [field, meta, helpers] = useField<number | ''>(name);
  const { setFieldTouched } = useFormikContext<{ [key: string]: any }>();

  const handleClick = useCallback(
    (value: number) => {
      helpers.setValue(value);
      setFieldTouched(name, true, false);
    },
    [helpers, name, setFieldTouched]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const current = typeof field.value === 'number' ? field.value : min - 1;
      const next =
        e.key === 'ArrowRight'
          ? Math.min(current + 1, max)
          : Math.max(current - 1, min);
      helpers.setValue(next);
      setFieldTouched(name, true, false);
    },
    [field.value, helpers, max, min, name, setFieldTouched]
  );

  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const hasError = meta.touched && !!meta.error;

  return (
    <div
      className={`w-full flex flex-col gap-2 ${className}`}
      onKeyDown={handleKeyDown}
      role="group"
      aria-labelledby={`${name}-label`}
    >
      <h4
        id={`${name}-label`}
        className="m-0 font-medium text-xs text-lightBlue"
      >
        {question}
      </h4>

      <div className="flex justify-between gap-2 sm:gap-3">
        {numbers.map((num) => {
          const active = field.value === num;
          return (
            <button
              key={num}
              type="button"
              aria-pressed={active}
              onClick={() => handleClick(num)}
              className={[
                // base
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full border text-xs sm:text-sm flex items-center justify-center select-none transition',
                'bg-white dark:bg-[var(--cf-card,#0b1020)]',
                'border-gray-300 dark:border-gray-700',
                'hover:border-[var(--cf-primary,#6366f1)]',
                // active
                active
                  ? 'border-[var(--cf-primary,#6366f1)] ring-2 ring-[var(--cf-primary,#6366f1)]/20 text-[var(--cf-primary,#6366f1)] font-semibold'
                  : 'text-[var(--cf-muted,#64748b)]',
              ].join(' ')}
            >
              {num}
            </button>
          );
        })}
      </div>

      <p className="m-0 text-xs sm:text-sm text-[var(--cf-muted,#64748b)]">
        1 – least likely <span className="ml-4">10 – most likely</span>
      </p>

      {hasError && (
        <div className="mt-1 text-xs sm:text-sm text-[var(--cf-error,#ef4444)]">
          {meta.error}
        </div>
      )}
    </div>
  );
}
