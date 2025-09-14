'use client';

import React from 'react';
import { useField, FieldHookConfig } from 'formik';
import clsx from 'clsx';

type Level = 'none' | 'low' | 'moderate';

const LEVELS: { id: Level; label: string; emoji: string; desc: string }[] = [
  { id: 'none', label: 'None', emoji: '🚫', desc: 'No emojis' },
  { id: 'low', label: 'Low', emoji: '🙂', desc: 'Few emojis' },
  { id: 'moderate', label: 'Moderate', emoji: '😄', desc: 'Some emojis' },
];

type Props = {
  name: string; // e.g., "emojiLevel"
  label?: string;
  className?: string;
  disabled?: boolean;
};

const EmojiLevelField: React.FC<Props> = ({
  name,
  label = 'Emoji level',
  className = '',
  disabled = false,
}) => {
  const [field, meta, helpers] = useField<Level>({
    name,
  } as FieldHookConfig<Level>);
  const current: Level = (field.value as Level) ?? 'none';
  const hasError = Boolean(meta.touched && meta.error);

  const choose = (id: Level) => {
    if (disabled) return;
    helpers.setValue(id);
    helpers.setTouched(true, true);
  };

  return (
    <div className={clsx('mb-6 w-full', className)}>
      <div className="mb-2 block text-sm font-semibold text-white/70">
        {label}
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        className="flex items-center gap-2"
      >
        {LEVELS.map((l) => {
          const active = current === l.id;
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(l.id)}
              disabled={disabled}
              title={l.desc}
              className={clsx(
                'md:px-3 md:py-2 px-2 py-0.7 rounded-lg border md:text-sm text-[12px] flex items-center gap-2 transition-colors',
                active
                  ? 'border-purple-500 bg-purple-600/50 text-white'
                  : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span aria-hidden="true" className="text-base">
                {l.emoji}
              </span>
              <span>{l.label}</span>
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

export default EmojiLevelField;
