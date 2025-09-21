import { createContext, useState } from 'react';

interface IModalProvider {
  children: React.ReactNode;
}

interface IModalContext {
  displayModal: (...args: any) => void;
  showModal: boolean;
}

export const ModalContext = createContext<IModalContext | null>(null);

export const ModalProvider: React.FC<IModalProvider> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        displayModal: setShowModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
