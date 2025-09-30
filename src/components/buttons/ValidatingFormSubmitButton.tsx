'use client';

import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { LoadingTwotoneLoop } from '../icons/LoadingLoop';

interface IValidatingFormSubmitButton {
  loading?: boolean;
  children: string | React.ReactNode;
  className?: string;
  alwaysActive?: boolean;
  disabled?: boolean;
}

const ValidatingFormSubmitButton: React.FC<IValidatingFormSubmitButton> = ({
  loading = false,
  children,
  className = '',
  alwaysActive = false,
  disabled,
}) => {
  // grab everything from Formik
  const { dirty, isValid, values, errors } = useFormikContext<any>();

  // log out values & errors whenever they change
  useEffect(() => {
    console.log('Formik values:', values);
    console.log('Formik errors:', errors);
  }, [values, errors]);

  // disable logic
  const isDisabled = alwaysActive ? false : !(isValid && dirty);

  const baseStyles = `
    py-2 px-4 rounded-md text-white text-sm md:text-[16px] transition cursor-pointer disabled:cursor-not-allowed flex justify-center items-center gap-3
  `;

  const enabledStyles = `
    bg-purple-500 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
  `;

  const disabledStyles = `
    bg-gray-400 opacity-55
  `;

  return (
    <button
      type="submit"
      disabled={disabled || isDisabled}
      className={`
        ${baseStyles}
        ${isDisabled || disabled ? disabledStyles : enabledStyles}
        ${className}
      `}
    >
      {children}
      {loading && (
        <span className="w-4 h-4 text-mainWhite">
          <LoadingTwotoneLoop />
        </span>
      )}
    </button>
  );
};

export default ValidatingFormSubmitButton;
