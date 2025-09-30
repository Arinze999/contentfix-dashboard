'use client';

import React, { useId, useRef, useState } from 'react';
import {
  PromptSchema,
  PromptInitialValues,
  PromptDataType,
} from '@/models/chat/Chat.model';
import { FormComponent } from '../form/FormComponent';
import { TextAreaInputField } from '../form/FormField';
import ToggleButton from '../form/ToggleButton';
import ToneMultiSelectField from '../form/ToneMultiselectfield';
import { TONE_OPTIONS } from '@/constants/tones';
import EmojiLevelField from '../form/EmojiLevelField';
import ValidatingFormSubmitButton from '../buttons/ValidatingFormSubmitButton';
import { StarsC } from '../icons/Stars';
import clsx from 'clsx';
import { Close } from '../icons/Close';
import { Options } from '../icons/Options';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useSendPromptContext } from '@/context/SendPromptContext';
import LengthField from '../form/LengthField';
import { InputStatusSelect } from '../form/InputStatusSelect';

const NewContent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btnRef = useRef<HTMLButtonElement>(null!);
  const panelRef = useClickOutside<HTMLDivElement, HTMLButtonElement>(
    () => setOpen(false),
    open,
    [btnRef]
  );

  const { sendPrompt, loading } = useSendPromptContext();

  const onSubmit = (values: PromptDataType) => {
    sendPrompt(values);
  };

  return (
    <FormComponent
      initialValues={PromptInitialValues}
      schema={PromptSchema}
      onSubmit={onSubmit}
      className="z-20 border"
    >
      {/* Floating panel (collapsible) */}
      <div
        ref={panelRef}
        id={panelId}
        className={clsx(
          'absolute z-5',
          'left-1/2 -translate-x-1/2 bottom-30 md:bottom-40',
          '',
          'w-full max-w-3xl md:max-w-2xl',
          'rounded-2xl border border-white/15 bg-[#191d2e] backdrop-blur-xl',
          'shadow-[0_0_3px_rgba(139,92,246,0.25)]',
          'transition-all duration-300 overflow-hidden',
          open
            ? 'opacity-100 pointer-events-auto max-h-[70vh]'
            : 'opacity-0 pointer-events-none max-h-0'
        )}
      >
        <div className="p-4 md:p-5 max-h-[70vh] overflow-auto">
          {/* Platforms */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-white/80 mb-2">
              <InputStatusSelect />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ToggleButton name="linkedin" label="LinkedIn" />
              <ToggleButton name="twitter" label="Twitter" />
              <ToggleButton name="threads" label="Threads" />
              <ToggleButton name="official" label="Official" />
            </div>
          </div>

          {/* Tone + Emoji */}
          <div className="">
            <ToneMultiSelectField name="tones" options={TONE_OPTIONS} />
            <EmojiLevelField name="emojiLevel" />
            <LengthField name="length" />
          </div>
        </div>
      </div>

      {/* Composer pinned at bottom-center */}
      <div
        className={clsx(
          'absolute bottom-0 z-3',
          'left-1/2 -translate-x-1/2 bottom-0 md:bottom-0',
          'w-full max-w-3xl pb-3 sm:pb-4'
        )}
      >
        <div className="rounded-2xl border-2 border-white/15 bg-[#191d2e] backdrop-blur-xl p-3 sm:p-4 shadow-lg">
          <TextAreaInputField
            placeholder="Post/Rough idea here..."
            label=""
            name="message"
            className="mb-3"
            h='h-12'
          />

          <div className="flex justify-between">
            {/* Floating panel toggle (always visible, above composer) */}
            <button
              ref={btnRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className={clsx(
                'text-sm',
                // position: sit above the composer
                'right-4 md:right-8 bottom-28 md:bottom-32',
                'w-25 rounded-full',
                'bg-white/10 border-2 border-white/20 backdrop-blur-md',
                'flex items-center justify-center',
                'hover:bg-white/15 active:scale-[0.98]',
                'transition'
              )}
              title={open ? 'Hide options' : 'Show options'}
            >
              {/* sliders icon */}
              {/* <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="text-white/90"
              >
                <path
                  fill="currentColor"
                  d="M3 7h10v2H3V7m8 10H3v-2h8v2m10-6H3v-2h18v2m-6 6h6v-2h-6v2z"
                />
              </svg> */}
              {open ? <Close/> : <Options />}{' '}
              <span className="text-[12px]">options</span>
            </button>
            <ValidatingFormSubmitButton
              disabled={loading}
              loading={loading}
              className="md:w-[7.5rem] w-[4rem] h-10 gradientBgBtn"
            >
              <span className="hidden md:inline min-w-[16px]">Enhance</span>{' '}
              {!loading && <StarsC />}
            </ValidatingFormSubmitButton>
          </div>
        </div>
      </div>
    </FormComponent>
  );
};

export default NewContent;
