import * as Yup from 'yup';

/** Form/DB shape */
export const PersonasSchema = Yup.object({
  persona1: Yup.object({
    description: Yup.string().trim().optional(),
    default: Yup.boolean().required(),
  }).required(),
  persona2: Yup.object({
    description: Yup.string().trim().optional(),
    default: Yup.boolean().required(),
  }).required(),
})
  // at least one description
  .test('at-least-one-description', 'Provide at least one persona description.', (v) => {
    const d1 = v?.persona1?.description?.trim() ?? '';
    const d2 = v?.persona2?.description?.trim() ?? '';
    return d1.length > 0 || d2.length > 0;
  })
  // only one default = true
  .test('one-active', 'Only one persona can be default.', (v) => {
    const a = !!v?.persona1?.default;
    const b = !!v?.persona2?.default;
    return !(a && b);
  });

export type PersonasFormData = Yup.InferType<typeof PersonasSchema>;

export const personasInitialValues: PersonasFormData = {
  persona1: { description: '', default: false },
  persona2: { description: '', default: false },
};

/** Reusable TS types for app state (matches DB) */
export type Persona = { description: string; default: boolean };
export type Personas = { persona1: Persona; persona2: Persona };
