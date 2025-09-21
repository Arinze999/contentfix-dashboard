'use client';

import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '@/context/ModalContext';

type ModalProps = { children: React.ReactNode };

export const Modal: React.FC<ModalProps> = ({ children }) => {
  const modalContext = useContext(ModalContext);
  const show = !!modalContext?.showModal;

  if (typeof window === 'undefined') return null;
  const modalRoot = document.getElementById('modal-root') ?? document.body;

  return createPortal(
    <div
      className={[
        // positioning + overlay
        'fixed inset-0 w-screen h-screen overflow-auto isolate z-50',
        'bg-black/60',
        // layout: center on small; center horizontally on md+
        'grid place-items-center md:place-items-start md:justify-center',
        // toggle
        show ? 'block' : 'hidden',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>,
    modalRoot
  );
};
