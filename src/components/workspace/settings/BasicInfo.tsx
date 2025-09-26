'use client';

import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import { FormComponent } from '@/components/form/FormComponent';
import { TextInputField2 } from '@/components/form/FormField';
import { useEditProfile } from '@/hooks/user/useEditProfile';
import {
  BasicInfoDataType,
  basicInfoInitialValues,
  BasicInfoSchema,
} from '@/models/user/basicInfo.model';
import { useAppSelector } from '@/redux/store';
import React from 'react';

const BasicInfo = () => {
  const auth = useAppSelector((state) => state.auth);

  const user = useAppSelector((state) => state.userData);

  const { editProfile, loading } = useEditProfile();

  let dynamiceInitialValues = basicInfoInitialValues;

  if (auth.username && auth.email && user.username) {
    dynamiceInitialValues = {
      userName: user.username,
      email: auth.email,
    };
  }

  const handleSubmit = (values: BasicInfoDataType) => {
    editProfile(values);
  };

  return (
    <FormComponent
      initialValues={dynamiceInitialValues}
      schema={BasicInfoSchema}
      onSubmit={handleSubmit}
    >
      <TextInputField2 name="userName" label="Username" />
      <TextInputField2 name="email" label="Email" readOnly />
      <ValidatingFormSubmitButton className="w-fit" loading={loading}>
        Sav{loading ? 'ing...' : 'e'}
      </ValidatingFormSubmitButton>
    </FormComponent>
  );
};

export default BasicInfo;
