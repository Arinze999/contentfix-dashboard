'use client';

import React, { useEffect, KeyboardEvent, useId } from 'react';
import { useField, FieldHookConfig } from 'formik';
import clsx from 'clsx';

type ToggleButtonFieldProps = {
  name: string; // Formik boolean field name
  label?: string; // Optional visible label
  className?: string; // Wrapper classes
  disabled?: boolean;
  loading?: boolean;
};

const ToggleButtonField: React.FC<ToggleButtonFieldProps> = ({
  name,
  label,
  className = '',
  disabled = false,
  loading = false,
}) => {
  const labelId = useId();
  const [field, meta, helpers] = useField<boolean>({
    name,
  } as FieldHookConfig<boolean>);

  const isOn = Boolean(field.value);
  const hasError = Boolean(meta.touched && meta.error);

  // Default to false on first mount if undefined
  useEffect(() => {
    if (typeof field.value === 'undefined') helpers.setValue(false, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (disabled || loading) return;
    helpers.setValue(!isOn);
    helpers.setTouched(true, true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <span
          id={labelId}
          className={`block text-sm font-semibold text-white mb-2 ${disabled && 'opacity-30'}`}
        >
          {label}
        </span>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-busy={loading}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hasError ? `${labelId}-err` : undefined}
          disabled={disabled || loading}
          onClick={toggle}
          onKeyDown={onKeyDown}
          className={clsx(
            'relative inline-flex items-center w-8 md:w-10 h-4 md:h-6 rounded-full border-2',
            'transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-30',
            loading
              ? 'bg-[#3b82f6]/20 border-[#3b82f6]/20 cursor-not-allowed text-purple-500'
              : isOn
              ? 'bg-purple-500 border-purple-500 text-purple-500'
              : 'bg-gray-300 border-gray-300 text-gray-400'
          )}
        >
          {loading ? (
            <span className="ml-1 h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <span
              className={clsx(
                'absolute md:top-0.5 left-0.5 md:h-4 h-3 w-3 md:w-4 rounded-full bg-white shadow-sm',
                'transition-transform duration-200 will-change-transform',
                isOn ? 'md:translate-x-4 translate-x-3' : 'translate-x-0'
              )}
            />
          )}
        </button>

        {/* <span className="text-sm text-white/70 select-none">
          {isOn ? 'On' : 'Off'}
        </span> */}
      </div>

      {hasError && (
        <p id={`${labelId}-err`} className="mt-1 text-sm text-red-500">
          {meta.error as string}
        </p>
      )}
    </div>
  );
};

export default ToggleButtonField;
