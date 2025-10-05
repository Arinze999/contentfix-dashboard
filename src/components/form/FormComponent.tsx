'use client';

import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';

interface IFormComponent {
  initialValues: any;
  schema: any;
  onSubmit: (e: any, actions: FormikHelpers<any>) => void;
  children: React.ReactNode;
  className?: string;
  autoComplete?: string;
}

export const FormComponent: React.FC<IFormComponent> = ({
  initialValues,
  schema,
  onSubmit,
  children,
  className,
  autoComplete = 'on',
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      <Form
        className={`${className} grid gap-[16px] md:gap-[24px] w-full grid-cols-1`}
        autoComplete={autoComplete}
      >
        {children}
      </Form>
    </Formik>
  );
};
