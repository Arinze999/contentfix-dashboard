'use client';

import React, { useRef } from 'react';
import { PostItem } from '@/types/social';
import { ModalProvider } from '@/context/ModalContext';
import ModalTriggerContainer from '../modals/ModalTriggerContainer';
import { Modal } from '../modals/Modal';
import { compact } from '@/utils/utils';
import HistoryModal from '../modals/modalcontents/HistoryModal';

interface More {
  id: string;
}

interface HistoryCardProps extends PostItem {
  isMobile: boolean;
  clickedIdAction?: () => void;
  className?: string;
  isActive: boolean;
}

/* eslint-disable react/display-name */
const ShowModal = React.forwardRef<HTMLDivElement, More>(({ id }, ref) => {
  return (
    <ModalProvider>
      <ModalTriggerContainer ref={ref} display="none">
        <></>
      </ModalTriggerContainer>
      <Modal>
        <HistoryModal id={id} />
      </Modal>
    </ModalProvider>
  );
});

const HistoryCard: React.FC<HistoryCardProps> = ({
  isMobile,
  className,
  clickedIdAction,
  id,
  isActive,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMobile = () => {
    triggerRef.current?.click();
  };

  const handlePC = () => {
    clickedIdAction?.();
  };

  console.log(id);

  if (isMobile)
    return (
      <div
        onClick={handleMobile}
        className={`${className} border p-3 rounded-xl bg-[#0111297a] border-lightBlue/5 w-full cursor-pointer`}
      >
        <p className="font-bold text-gray-500">
          Post <span className="text-sm font-thin">{compact(id)}</span>
        </p>
        <ShowModal ref={triggerRef} id={id ?? ''} />
      </div>
    );

  return (
    <div
      onClick={handlePC}
      className={`${className} p-3 rounded-xl min-w-[300px] cursor-pointer ${
        isActive
          ? 'bg-purple-400/10 border-purple-300/50 text-purple-300 border-2'
          : 'bg-[#0111297a] border-lightBlue/5 border'
      }`}
    >
      <p className="font-bold text-gray-500">
        Post <span className="text-sm font-thin">{compact(id)}</span>
      </p>
    </div>
  );
};

export default HistoryCard;
