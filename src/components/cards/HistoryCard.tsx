'use client';

import React, { useRef } from 'react';
import { PostItem } from '@/types/social';
import { ModalProvider } from '@/context/ModalContext';
import ModalTriggerContainer from '../modals/ModalTriggerContainer';
import { Modal } from '../modals/Modal';
import ModalContainer from '../modals/ModalContainer';

interface HistoryCardProps extends PostItem {
  isMobile: boolean;
  clickedIdAction?: () => void;
  className?: string;
}

/* eslint-disable react/display-name */
const ShowModal = React.forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <ModalProvider>
      <ModalTriggerContainer ref={ref} display="none">
        <></>
      </ModalTriggerContainer>
      <Modal>
        <ModalContainer maxwidth="63rem" padding="2rem">
          <p>herererer</p>
        </ModalContainer>
      </Modal>
    </ModalProvider>
  );
});

const HistoryCard: React.FC<HistoryCardProps> = ({
  isMobile,
  className,
  clickedIdAction,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMobile = () => {
    triggerRef.current?.click();
  };

  const handlePC = () => {
    clickedIdAction?.();
  };

  if (isMobile)
    return (
      <div onClick={handleMobile} className={className}>
        mobile <ShowModal ref={triggerRef} />
      </div>
    );

  return <div onClick={handlePC}>HistoryCard</div>;
};

export default HistoryCard;
