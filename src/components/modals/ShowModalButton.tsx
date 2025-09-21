'use client';

import { useContext } from 'react';
import { ModalContext } from '@/context/ModalContext';

type ShowModalButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

const ShowModalButton: React.FC<ShowModalButtonProps> = ({
  children,
  icon,
  className,
}) => {
  const modal = useContext(ModalContext);
  const isPostJob = className?.includes('post-job');

  const base = [
    // base styles
    'bg-blue-600 text-white font-medium rounded cursor-pointer',
    'inline-flex items-center justify-center gap-2',
    'px-14 py-2.5 text-sm',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  // replicate `.post-job` responsive rules
  if (isPostJob) {
    base.push(
      'w-auto', // fit-content equivalent
      'max-[780px]:text-base max-[780px]:px-8 max-[780px]:py-2.5 max-[780px]:-ml-[18px]',
      'max-[480px]:text-sm max-[480px]:px-5 max-[480px]:py-1.5'
    );
  }

  return (
    <button
      type="button"
      onClick={() => modal?.displayModal(true)}
      className={[...base, className].filter(Boolean).join(' ')}
    >
      {children}
      {icon}
    </button>
  );
};

export default ShowModalButton;
