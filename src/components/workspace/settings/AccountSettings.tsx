'use client';

import ImageUploadButton from '@/components/buttons/ImageUploadButton';
import { FormComponent } from '@/components/form/FormComponent';
import { LoadingTwotoneLoop } from '@/components/icons/LoadingLoop';
import { useUploadProfileImage } from '@/hooks/user/useUploadProfileImage';
import {
  ProfileImageDataType,
  ProfileImageSchema,
  profileImageValues,
} from '@/models/user/profileImage.model';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import BasicInfo from './BasicInfo';

const AccountSettings = () => {
  const user = useAppSelector((state) => state.userData);

  const auth = useAppSelector((state) => state.auth);

  const { uploadProfileImage, loading, failed } = useUploadProfileImage();
  const [defaultImgUrl, setDefaultImgUrl] = useState<string | null>(
    user?.avatar_url ?? '/img/user.png'
  );

  const handleSubmit = (values: ProfileImageDataType) => {
    uploadProfileImage(values);
  };

  useEffect(() => {
    if (failed) setDefaultImgUrl('/img/user.png');
  }, [failed]);

  return (
    <div className="p-3 md:p-4 h-fit rounded-xl bg-blue-400/10 border-blue-300/50 w-full col-start gap-6 max-w-[500px]">
      <FormComponent
        initialValues={profileImageValues}
        schema={ProfileImageSchema}
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4">
          <div className="border-2 w-[70px] md:w-[100px] h-[70px] md:h-[100px] border-blue-300/10 overflow-hidden flex-center rounded-xl relative">
            {loading && (
              <div className="absolute bg-black/70 w-full h-full flex-center">
                <LoadingTwotoneLoop />
              </div>
            )}
            <Image
              src={defaultImgUrl!}
              alt="profileImage"
              width={100}
              height={100}
            />
          </div>

          <div className="">
            <p className="text-sm">{user.username}</p>
            <p className="text-sm mb-2">{auth.email}</p>
            <ImageUploadButton
              id="profileImage"
              name="profileImage"
              defaultImgUrl={defaultImgUrl}
              setDefaultImgUrl={setDefaultImgUrl}
            />
          </div>
        </div>
      </FormComponent>

      <hr className="border border-white/10" />
      <BasicInfo />
    </div>
  );
};

export default AccountSettings;
