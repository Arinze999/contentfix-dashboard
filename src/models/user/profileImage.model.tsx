import * as Yup from 'yup';

export const ProfileImageSchema = Yup.object().shape({
  profileImage: Yup.mixed<File>()
    // .required('An image is required')
    .nullable()
    .test(
      'fileSize',
      'Image should be less than 3MB',
      (value: File | null | undefined) => {
        return !value || value.size <= 3000000;
      }
    )
    .test(
      'fileType',
      'Unsupported image format',
      (value: File | null | undefined) => {
        return (
          !value ||
          ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
        );
      }
    ),
});

export type ProfileImageDataType = Yup.InferType<typeof ProfileImageSchema>;

type InitialValues = {
  profileImage: string;
};

export const profileImageValues: InitialValues = {
  profileImage: '',
};
