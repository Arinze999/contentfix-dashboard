'use client';

import React from 'react';
import { FormComponent } from '@/components/form/FormComponent';
import {
  SignupDataType,
  SignupInitialValues,
  SignupSchema,
} from '@/models/auth/SignUp.model';
import {
  PasswordInputField,
  TextInputField,
} from '@/components/form/FormField';
import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import Button from '@/components/buttons/Button';
import { Google } from '@/components/icons/Google';
import Link from 'next/link';
import { SIGN_IN } from '@/routes/routes';
import { FormikHelpers } from 'formik';
import { useSignup } from '@/hooks/auth/useSignUp';
import { useServerSignUp } from '@/hooks/auth/server/useServerSignUp';

const SignUp = () => {
  const { loading } = useSignup();

  const { signUp, serving } = useServerSignUp();

  // const handleSubmit = (
  //   values: SignupDataType,
  //   actions: FormikHelpers<SignupDataType>
  // ) => {
  //   signUpAction(values);
  //   signupUser(values);
  //   console.log(values);
  //   actions.resetForm({ values: SignupInitialValues });
  // };

  const handleSubmitServer = async (
    values: SignupDataType,
    actions: FormikHelpers<SignupDataType>
  ) => {
    await signUp(values);
    actions.resetForm({ values: SignupInitialValues });
  };

  return (
    <div className="border-white/20 md:shadow-md rounded-2xl w-full max-w-2xl md:p-10 col-center gap-10">
      <h3 className="text-2xl md:text-4xl font-bold">Create Account</h3>
      <FormComponent
        initialValues={SignupInitialValues}
        schema={SignupSchema}
        onSubmit={handleSubmitServer}
      >
        <TextInputField name="identifier" placeholder="Email" />
        <TextInputField name="userName" placeholder="Username" />
        <PasswordInputField name="password" placeholder="Password" />
        <PasswordInputField
          name="confirmPassword"
          placeholder="Confirm password"
        />
        <ValidatingFormSubmitButton
          loading={loading || serving}
          disabled={loading || serving}
        >
          Create account
        </ValidatingFormSubmitButton>
      </FormComponent>
      or
      <Button
        text="Sign up with Google"
        className="bg-white text-black w-full py-2 rounded-md"
        icon={<Google />}
      />
      <hr className="border-white/30 border-1 w-full my-3" />
      <div className="text-sm">
        Already hace an account?{' '}
        <Link className="text-blue-500 underline" href={`/${SIGN_IN}`}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
