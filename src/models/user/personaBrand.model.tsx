import * as Yup from 'yup';

export const PersonaBrandSchema = Yup.object({
  persona1: Yup.string().trim().optional(),
  persona2: Yup.string().trim().optional(),
  brand1: Yup.string().trim().optional(),
}).test(
  'at-least-one',
  'Please provide at least one persona or brand.',
  (value) => {
    if (!value) return false;
    const { persona1, persona2, brand1, brand2 } = value as {
      persona1?: string;
      persona2?: string;
      brand1?: string;
      brand2?: string;
    };
    return [persona1, persona2, brand1, brand2].some(
      (v) => (v ?? '').trim().length > 0
    );
  }
);

export type PersonaBrandDataType = Yup.InferType<typeof PersonaBrandSchema>;

export const personaBrandInitialValues: PersonaBrandDataType = {
  persona1: '',
  persona2: '',
  brand1: '',
};
