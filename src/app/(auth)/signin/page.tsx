'use client';

import React, { useEffect } from 'react';
import { FormComponent } from '@/components/form/FormComponent';
import {
  PasswordInputField,
  TextInputField,
} from '@/components/form/FormField';
import ValidatingFormSubmitButton from '@/components/buttons/ValidatingFormSubmitButton';
import Button from '@/components/buttons/Button';
import { Google } from '@/components/icons/Google';
import Link from 'next/link';
import { ACCOUNT, SIGN_UP } from '@/routes/routes';
import {
  SigninDataType,
  SigninInitialValues,
  SigninSchema,
} from '@/models/auth/SignIn.model';
import { FormikHelpers } from 'formik';
import { useSignIn } from '@/hooks/auth/useSignIn';
import { useServerSignIn } from '@/hooks/auth/server/useServerSignIn';
import { signInWithGoogle } from '@/actions/signInGoogleAction';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const SignIn = () => {
  const { loading } = useSignIn();

  const { signIn, serving } = useServerSignIn();

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.replace('/');
    };
    check();

    // re-check when page is restored from bfcache via back button
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) check();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [router]);

  // const handleSubmit = (
  //   values: SigninDataType,
  //   actions: FormikHelpers<SigninDataType>
  // ) => {
  //   signInUser(values);
  //   console.log(values);
  //   actions.resetForm({ values: SigninInitialValues });
  // };

  const handleSubmitServer = async (
    values: SigninDataType,
    actions: FormikHelpers<SigninDataType>
  ) => {
    await signIn(values);
    actions.resetForm({ values: SigninInitialValues });
  };

  const handleGoogle = () => {
    signInWithGoogle(`/${ACCOUNT}`);
  };

  return (
    <div className="border-white/20 md:shadow-md rounded-2xl w-full max-w-2xl md:p-10 col-center gap-10">
      <h3 className="text-2xl md:text-4xl font-bold">Sign In</h3>
      <FormComponent
        initialValues={SigninInitialValues}
        schema={SigninSchema}
        onSubmit={handleSubmitServer}
      >
        <TextInputField name="identifier" placeholder="Email" />
        <PasswordInputField name="password" placeholder="Password" />
        <ValidatingFormSubmitButton
          loading={loading || serving}
          disabled={loading || serving}
        >
          Login
        </ValidatingFormSubmitButton>
      </FormComponent>
      or
      <Button
        text="Sign in with Google"
        className="bg-white text-black w-full py-2 rounded-md"
        icon={<Google />}
        onClick={handleGoogle}
      />
      <hr className="border-white/30 border-1 w-full my-3" />
      <div className="text-sm">
        Don't have an account?{' '}
        <Link className="text-blue-500 underline" href={`/${SIGN_UP}`}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
