import * as Yup from 'yup';

export const TONE_IDS = [
  'professional',
  'conversational',
  'playful',
  'persuasive',
  'empathetic',
] as const;
export const EMOJI_LEVELS = ['none', 'low', 'moderate'] as const;

export const LENGTH_IDS = ['short', 'average', 'long'] as const;

export const INPUT_STATUS_IDS = ['idea', 'refinement'] as const;
export type InputStatus = (typeof INPUT_STATUS_IDS)[number];

export const PromptSchema = Yup.object({
  message: Yup.string().trim().required(''),
  tones: Yup.array().of(Yup.string().oneOf(TONE_IDS as unknown as string[])),
  // .min(1, 'Select at least 1 tone')
  // .max(2, 'Select up to 2 tones')
  // .required('Select up to 2 tones'),
  // platforms: Yup.array()
  //   .of(Yup.string())
  //   .min(1, 'Choose at least one platform'),
  linkedin: Yup.boolean().nullable(),
  twitter: Yup.boolean().nullable(),
  threads: Yup.boolean().nullable(),
  official: Yup.boolean().nullable(),
  // personality: Yup.string().trim().optional(),
  emojiLevel: Yup.string()
    .oneOf(EMOJI_LEVELS as unknown as string[])
    .optional(),
  length: Yup.string()
    .oneOf(LENGTH_IDS as unknown as string[])
    .optional(),
  inputStatus: Yup.string()
    .oneOf(INPUT_STATUS_IDS as unknown as string[])
    .required(''),
});

export type PromptDataType = Yup.InferType<typeof PromptSchema>;

export const PromptInitialValues: PromptDataType = {
  message: '',
  tones: [],
  // platforms: [],
  linkedin: true,
  twitter: false,
  threads: false,
  official: false,
  // personality: '',
  emojiLevel: 'none',
  length: 'average',
  inputStatus: 'idea',
};
