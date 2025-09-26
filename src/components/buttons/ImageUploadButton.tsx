'use client';

import React, { useEffect } from 'react';
import { useField, useFormikContext } from 'formik';

export interface ImageUploadButtonProps {
  className?: string;
  id?: string;
  name: string;
  defaultImgUrl?: string | null;
  setDefaultImgUrl: (...args: any) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  setDefaultImgUrl,
  className,
  id,
  name,
}) => {
  const { submitForm } = useFormikContext<any>();
  const [field, meta, helpers] = useField<File | null>({ name });

  useEffect(() => {
    const file = field.value;
    if (file instanceof File) {
      const previewUrl = URL.createObjectURL(file);
      setDefaultImgUrl(previewUrl);
      submitForm();
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [field.value, setDefaultImgUrl, submitForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) helpers.setValue(file);
  };

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="flex items-center gap-4">
        <label
          htmlFor={name || id}
          className="inline-flex items-center gap-4 cursor-pointer w-fit"
        >
          <span className="text-sm font-medium border-2 border-neutral-400 text-neutral-400 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg hover:border-neutral-300 hover:text-neutral-300 transition-colors">
            Upload Profile Image
          </span>
          <input
            id={name || id}
            name={name}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {meta.touched && meta.error ? (
        <p className="text-xs text-red-400">{String(meta.error)}</p>
      ) : null}
    </div>
  );
};

export default ImageUploadButton;
