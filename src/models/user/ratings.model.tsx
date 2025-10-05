// src/models/ratings.model.tsx
import * as Yup from 'yup';

export const RatingsSchema = Yup.object().shape({
  ratings: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    )
    .typeError('Rating must be a number')
    .required('Rating is required')
    .integer('Rating must be a whole number')
    .min(1, 'Minimum rating is 1')
    .max(10, 'Maximum rating is 10'),
  info: Yup.string().trim().notRequired(),
});

export type RatingsDataType = Yup.InferType<typeof RatingsSchema>;

type InitialValues = {
  ratings: number | '';
  info: string;
};

export const ratingsValues: InitialValues = {
  ratings: '',
  info: '',
};
