import React, { useContext, forwardRef } from 'react';
import { ModalContext } from '../../context/ModalContext';

interface ModalTriggerContainerProps {
  children: React.ReactNode;
  width?: string;
  display?: string;
}

/* eslint-disable react/display-name */
const ModalTriggerContainer = forwardRef<
  HTMLDivElement,
  ModalTriggerContainerProps
>(({ children, width, display }, ref) => {
  const modalContext = useContext(ModalContext);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    modalContext?.displayModal(true);
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        width: `fit-content ${width}`,
        cursor: 'pointer',
        display: `${display}`,
      }}
    >
      {children}
    </div>
  );
});

export default ModalTriggerContainer;
