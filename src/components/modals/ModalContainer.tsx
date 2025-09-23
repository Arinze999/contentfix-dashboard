'use client';

import React, { useContext, useState } from 'react';
import { ModalContext } from '@/context/ModalContext';
import CloseIcon from '../icons/CloseIcon';

interface ModalContainerProps {
  children: React.ReactNode;
  /** width of the modal */
  width?: string;
  /** padding inside the modal */
  padding?: string;
  /** margin-top of the modal */
  marginTop?: string;
  /** whether to require a confirmation before closing */
  confirm?: boolean;
  /** content to show inside the confirmation modal */
  granChild?: React.ReactNode;
  /** callback when the confirmation modal is finally closed */
  onConfirmClose?: () => void;
  maxwidth?: string;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  width,
  padding,
  marginTop,
  confirm = false,
  granChild,
  onConfirmClose,
  maxwidth,
}) => {
  const { displayModal } = useContext(ModalContext)!;
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePrimaryClose = () => {
    console.log('clicked');

    if (confirm && !showConfirm) {
      setShowConfirm(true);
    } else {
      displayModal(false);
    }
  };

  const handleConfirmClose = () => {
    displayModal(false);
    onConfirmClose?.();
  };

  const baseStyle: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(padding ? { padding } : {}),
    ...(marginTop ? { marginTop } : {}),
    ...(maxwidth ? { maxWidth: maxwidth } : {}),
  };

  return (
    <>
      {/* Base modal card */}
      <div
        className={`
          bg-purple-300 text-dark rounded-lg
          mt-16 mb-16
          w-[95%] max-w-[90vw]
          flex flex-col gap-9
          px-20 pt-8 pb-16
          md:w-[90vw] md:p-10
          p-2
          shadow-xl
        `}
        style={baseStyle}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handlePrimaryClose}
          className="self-end inline-flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {children}
      </div>

      {/* Confirmation overlay + card (only if confirm flow is active) */}
      {confirm && showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={(e) => e.stopPropagation()}
          aria-hidden="true"
        >
          <div
            className={`
              bg-white rounded-lg
              mt-0
              w-auto max-w-[90vw]
              flex flex-col gap-9
              px-20 pt-8 pb-16
              md:w-[90vw] md:p-10
              sm:w-[94vw] sm:p-2
              shadow-2xl
            `}
            style={baseStyle}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={handleConfirmClose}
              className="self-end inline-flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
              aria-label="Confirm close"
            >
              <CloseIcon />
            </button>

            {granChild}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
