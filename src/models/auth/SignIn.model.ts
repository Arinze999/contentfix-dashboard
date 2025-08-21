import * as Yup from 'yup';

const phoneRegex = /^\+?\d{10,15}$/; // adjust to your locale

export const SigninSchema = Yup.object().shape({
  identifier: Yup.string()
    .required('Email or phone number is required')
    .test(
      'is-email-or-phone',
      'Must be a valid email or phone number',
      (value = '') =>
        // simple email check
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        // or phone check
        phoneRegex.test(value)
    ),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export type SigninDataType = Yup.InferType<typeof SigninSchema>;

export const SigninInitialValues: SigninDataType = {
  identifier: '',
  password: '',
};

export type AuthUser = { id: string | null; email: string | null; username: string | null };

export const initialState: AuthUser = { id: null, email: null, username: null };
