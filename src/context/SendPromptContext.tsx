'use client';

import React, { createContext, useContext, PropsWithChildren } from 'react';
import { useSendPrompt } from '@/hooks/prompt/useSendPrompt';
import type { PromptDataType } from '@/models/chat/Chat.model';

type SendResult = {
  content: string;
  id?: string;
  model?: string;
} | null;

type SendPromptContextValue = {
  sendPrompt: (values: PromptDataType) => Promise<void>;
  reset: () => void;
  loading: boolean;
  failed: string | null;
  result: SendResult;
};

const SendPromptContext = createContext<SendPromptContextValue | undefined>(
  undefined
);

export const SendPromptProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { sendPrompt, loading, failed, result, reset } = useSendPrompt();

  const value: SendPromptContextValue = {
    sendPrompt,
    reset,
    loading,
    failed,
    result,
  };

  return (
    <SendPromptContext.Provider value={value}>
      {children}
    </SendPromptContext.Provider>
  );
};

export function useSendPromptContext() {
  const ctx = useContext(SendPromptContext);
  if (!ctx) {
    throw new Error(
      'useSendPromptContext must be used within <SendPromptProvider>'
    );
  }
  return ctx;
}
