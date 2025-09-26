import * as Yup from 'yup';

export const BasicInfoSchema = Yup.object().shape({
  userName: Yup.string().required('username is required'),
  email: Yup.string()
    .email('Invalid email address')
});

export type BasicInfoDataType = Yup.InferType<typeof BasicInfoSchema>;

type InitialValues = {
  userName: string;
  email: string;
};

export const basicInfoInitialValues: InitialValues = {
  userName: '',
  email: '',
};