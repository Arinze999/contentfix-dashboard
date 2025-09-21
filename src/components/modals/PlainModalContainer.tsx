'use client';

import React, { useContext } from 'react';
import { ModalContext } from '@/context/ModalContext';
import CloseIcon from '../icons/CloseIcon';

type PlainModalContainerProps = {
  children: React.ReactNode;
  width?: string;
};

const PlainModalContainer: React.FC<PlainModalContainerProps> = ({
  children,
  width,
}) => {
  const modal = useContext(ModalContext);

  const onClickCancel = () => modal?.displayModal(false);

  return (
    <div
      className={[
        // spacing
        'p-[77px] pt-[30px] pb-[61px]',
        'mt-[60px] mb-[60px]',
        // layout
        'rounded-[10px] bg-transparent flex flex-col gap-[38px]',
        // default width + small screens
        'w-fit max-[480px]:w-[94vw]',
        'max-[480px]:py-[42px] max-[480px]:px-[24px]',
      ].join(' ')}
      style={width ? { width } : undefined}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClickCancel}
        className="self-end inline-flex items-center transition-transform hover:scale-110 focus:outline-none"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      {children}
    </div>
  );
};

export default PlainModalContainer;
