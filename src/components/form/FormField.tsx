'use client';
import React, { useState } from 'react';
import { useField, FieldHookConfig } from 'formik';
import EyeIcon from '../icons/EyeIcon';
import CanceledEyeIcon from '../icons/CanceledEyeIcon';
import clsx from 'clsx';
import Image from 'next/image';

/**
 * Props for both fields:
 */
interface BaseFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  /** URL or path to a left-placed icon */
  lpiSrc?: string;
  /** Make the input read-only (text field only) */
  readOnly?: boolean;
  /** Override wrapper styles */
  className?: string;
  required?: boolean;
}

/**
 * TextInputField
 */
export const TextInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  readOnly = false,
  className = '',
  required,
}) => {
  const [field, meta] = useField<string>({ name, type: 'text' });
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`mb-3 md:mb-6 w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm text-gray-800 mb-2 font-[700] font-inter"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}

        <input
          id={name}
          {...field}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`
            block w-full text-sm md:text-[16px]
            border-none bg-white/5 ${
              hasError ? 'border-red-500' : 'border-borderGray'
            }
            rounded-md 
            py-3
            ${lpiSrc ? 'pl-10' : 'pl-3'} pr-3
            focus:outline-none focus:ring-2 focus:ring-white/20
          `}
        />
      </div>

      {hasError && <p className="mt-1 text-xs md:text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * TextInputField
 */
export const TextInputField2: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  readOnly = false,
  className = '',
}) => {
  const [field, meta] = useField<string>({ name, type: 'text' });
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`mb-6 w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm text-primaryText mb-2 font-[700] font-inter"
      >
        {label}
      </label>

      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}

        <input
          id={name}
          {...field}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`
            block w-full
            border ${hasError ? 'border-red-500' : 'border-borderGray'}
            rounded-md 
            py-3
            ${lpiSrc ? 'pl-10' : 'pl-3'} pr-3
            focus:outline-none focus:ring-2 focus:ring-mainBlue
          `}
        />
      </div>

      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * PasswordInputField
 */
export const PasswordInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  className = '',
}) => {
  const [field, meta] = useField<string>({ name, type: 'password' });
  const [show, setShow] = useState(false);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`mb-3 md:mb-6 w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm text-primaryText mb-2 font-[700] font-inter"
      >
        {label}
      </label>

      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}

        <input
          id={name}
          {...field}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`
            block w-full bg-white/5 text-sm md:text-[16px]
            border ${hasError ? 'border-red-500' : 'border-none'}
            rounded-md 
            py-3
            ${lpiSrc ? 'pl-10' : 'pl-3'} pr-10
            focus:outline-none focus:ring-2 focus:ring-white/20
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
        >
          {show ? <CanceledEyeIcon /> : <EyeIcon />}
        </button>
      </div>

      {hasError && <p className="mt-1 text-xs md:text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * CheckboxField
 */
interface CheckboxFieldProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  children,
  className = '',
  ...props
}) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`flex flex-col items-start mb-6 ${className}`}>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          {...field}
          {...props}
          className="
            h-4 w-4
            text-mainBlue border-borderGray rounded
            focus:outline-none focus:ring-2 focus:ring-mainBlue
            cursor-pointer
          "
        />
        <span className="ml-2 font-[400] text-primaryText">{children}</span>
      </label>

      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * Textarea input
 */
export const TextAreaInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  readOnly = false,
  className = '',
}) => {
  const [field, meta] = useField<string>({
    name,
    type: 'textarea',
  } as FieldHookConfig<string>);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={clsx(className, 'mb-6 w-full')}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-borderGray/10 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}
        <textarea
          id={name}
          {...field}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={5}
          className={clsx(
            'block w-full h-12 scrollbar-hide rounded-md py-3 bg-borderGray/10 focus:outline-none focus:ring-2 focus:ring-mainBlue resize-y',
            hasError ? 'border-red-500' : 'border-gray-300',
            lpiSrc ? 'pl-10' : 'pl-3',
            'pr-3'
          )}
        />
      </div>
      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * File upload
 */
export const UploadField: React.FC<{
  label: string;
  name: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ label, name, className = '', children }) => {
  const [, meta, helper] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) helper.setValue(e.currentTarget.files[0]);
  };

  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={clsx('mb-6 w-full', className)}>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        onChange={handleChange}
        className="block w-full text-sm text-gray-700"
      />
      {children}
      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

// auth
export const AuthTextInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  readOnly = false,
  className = '',
}) => {
  const [field, meta] = useField<string>({ name, type: 'text' });
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`mb-6 w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm text-primaryText mb-2 font-[700] font-inter"
      >
        {label}
      </label>

      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}

        <input
          id={name}
          {...field}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`
            block w-full
            border-b ${hasError ? 'border-b-red-500' : 'border-borderGray'}
            py-3
            ${lpiSrc ? 'pl-10' : 'pl-3'} pr-3
            focus:outline-none focus:border-b-mainOrange
          `}
        />
      </div>

      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

/**
 * PasswordInputField
 */
export const AuthPasswordInputField: React.FC<BaseFieldProps> = ({
  label,
  name,
  placeholder,
  lpiSrc,
  className = '',
}) => {
  const [field, meta] = useField<string>({ name, type: 'password' });
  const [show, setShow] = useState(false);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className={`mb-6 w-full ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm text-primaryText mb-2 font-[700] font-inter"
      >
        {label}
      </label>

      <div className="relative">
        {lpiSrc && (
          <Image
            src={lpiSrc}
            alt="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        )}

        <input
          id={name}
          {...field}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`
            block w-full
            border-b ${hasError ? 'border-b-red-500' : 'border-b-borderGray'}
            py-3
            ${lpiSrc ? 'pl-10' : 'pl-3'} pr-10
            focus:outline-none focus:border-b-mainOrange
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
        >
          {show ? <CanceledEyeIcon /> : <EyeIcon />}
        </button>
      </div>

      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};
